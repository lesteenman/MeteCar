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

	categoriesToLists(categories, renderFunc) {
		let listItems = {};

		for (let [title, missions] of Object.entries(categories)) {
			let list = [];
			for (let i = 0; i < missions.length; i++) {
				let mission = missions[i];
				let page = '/missions/' + mission._id;
				let render = renderFunc(mission);
				list.push(
					<Link
						to={page}
						key={mission._id}
					>
						{render}
					</Link>
				);
			}
			listItems[title] = list;
		}

		let lists = [];

		for (let [title, list] of Object.entries(listItems)) {
			if (list.length) {
				lists.push(
					<List style={{margin: '10px 0'}} key={title}>
						<Subheader inset={true}>{title}</Subheader>
						{list}
					</List>
				);
			}
		}

		return lists;
	}

	adminRender() {
		let categories = {
			main: [],
			optional: [],
		};

		for (let mission of this.props.all) {
			if (mission.optional) categories['optional'].push(mission);
			else categories['main'].push(mission);
		}

		let lists = this.categoriesToLists(categories, this.adminMissionRender);

		return (
			<div>
				{lists}
			</div>
		);
	}

	normalRender() {
		let categories = {
			'Available': this.props.available,
			'Pending': this.props.sent,
			'Completed': this.props.approved,
		};

		let lists = this.categoriesToLists(categories, this.normalMissionRender);

		return (
			<div>
				{lists}
			</div>
		);
	}

	adminMissionRender(mission) {
		let icon = mission.open ? openIcon : closedIcon;
		return (
			<ListItem
				primaryText={mission.title}
				secondaryText={mission.description}
				rightIcon={icon}
			/>
		);
	}

	normalMissionRender(mission) {
		return (
			<ListItem
				primaryText={mission.title}
				secondaryText={mission.description}
			/>
		);
	}
}

export default createContainer(() => {
	if (isAdmin(Meteor.user())) {
		missionsHandle = Meteor.subscribe('missions.admin.all');
		return {
			ready: missionsHandle.ready(),
			all: Missions.find({}).fetch(),
		};
	}
	else {
		missionsHandle = Meteor.subscribe('missions.team');
		submissionsHandle = Meteor.subscribe('submissions.team');

		let team = Meteor.user().team;

		let sentSubmissions = Submissions.find({
			team: team,
			state: SubmissionState.SENT,
		}).fetch();
		let sentSubmissionIds = _.pluck(sentSubmissions, 'mission');

		let approvedSubmissions = Submissions.find({
			team: team,
			state: SubmissionState.APPROVED,
		}).fetch();
		let approvedSubmissionIds = _.pluck(approvedSubmissions, 'mission');

		available = Missions.find({
			$and: [
				{_id: {$nin: sentSubmissionIds}},
				{_id: {$nin: approvedSubmissions}},
			]
		}).fetch();
		sent = Missions.find({
			_id: {$in: sentSubmissionIds}
		}).fetch();
		approved = Missions.find({
			_id: {$in: approvedSubmissionIds}
		}).fetch();

		return {
			ready: missionsHandle.ready() && submissionsHandle.ready(),
			sent: sent,
			available: available,
			approved: approved,
		};
	}

}, MissionsPage);
