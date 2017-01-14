import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';

import { Missions } from '../../api/Missions.jsx';
import { Submissions, SubmissionState } from '../../api/Submissions.jsx';

import TitledPage from '../ui/TitledPage.jsx';

import { isAdmin } from '../../helpers/user.js';

import FontIcon from 'material-ui/FontIcon';
const openIcon = <FontIcon className="material-icons">lock_open</FontIcon>;
const closedIcon = <FontIcon className="material-icons">lock</FontIcon>;

class MissionsPage extends TitledPage {
	getTitle() { return "Missions"; }
	isReady() { return this.props.ready; }

	pageRender() {
		if (isAdmin(Meteor.user())) {
			return this.adminRender();
		} else {
			return this.normalRender();
		}

	}

	adminRender() {
		let all = [];

		for (let i = 0; i < this.props.all.length; i++) {
			let mission = this.props.all[i];
			let page = '/missions/' + mission._id;
			all.push(
				<Link
					to={page}
					key={mission._id}
				>
					<ListItem
						primaryText={mission.title}
						secondaryText={mission.description}
						rightIcon={mission.open ? openIcon : closedIcon}
					/>
				</Link>
			);
		}

		return (
			<List style={{margin: '10px 0'}}>
				{all}
			</List>
		);
	}

	normalRender() {
		let available = [];

		console.log('Available: ', this.props.available);

		for (let i = 0; i < this.props.available.length; i++) {
			let mission = this.props.available[i];
			let page = '/missions/' + mission._id;
			available.push(
				<Link
					to={page}
					key={mission._id}
				>
					<ListItem
						primaryText={mission.title}
						secondaryText={mission.description}
						key={mission._id}
					/>
				</Link>
			);
		}

		let complete = [];
		return (
			<div>
				<List style={{margin: '10px 0'}}>
					{available}
				</List>
				<List style={{margin: '10px 0'}}>
					{this.props.complete.length > 0 && <Subheader inset={true}>Completed</Subheader>}
					{complete}
				</List>
			</div>
		);
	}
}

export default createContainer(() => {
	let missionsHandle = Meteor.subscribe('missions.team');
	let submissionsHandle = Meteor.subscribe('submissions.team');

	let team = Meteor.user().team;
	let all, available, complete;

	if (isAdmin(Meteor.user())) {
		all = Missions.find({}).fetch();
	} else {
		let availableSubmissions = Submissions.find({
			team: team,
			state: {$in: [SubmissionState.OPEN, SubmissionState.SENT]},
		}).fetch();

		let completeSubmissions = Submissions.find({
			team: team,
			state: SubmissionState.APPROVED,
		}).fetch();

		available = Missions.find({
			_id: {$in: _.pluck(availableSubmissions, 'mission')}
		}).fetch();
		complete = Missions.find({
			_id: {$in: _.pluck(completeSubmissions, 'mission')}
		}).fetch();
	}

	return {
		ready: missionsHandle.ready() && (isAdmin(Meteor.user()) || submissionsHandle.ready()),
		all: all,
		available: available,
		complete: complete,
	};
}, MissionsPage);
