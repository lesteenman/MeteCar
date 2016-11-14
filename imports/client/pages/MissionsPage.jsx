import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';

import { Missions } from '../../api/Missions.jsx';
import { Submissions, SubmissionState } from '../../api/Submissions.jsx';

class MissionsPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);

		let all = [];
		console.log('All: ', this.props.all);
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
					/>
				</Link>
			);
		}

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
				<Helmet title='Missions' />
				<List style={{margin: '10px 0'}}>
					{available}
				</List>
				<List style={{margin: '10px 0'}}>
					{this.props.complete.length > 0 && <Subheader inset={true}>Completed</Subheader>}
					{complete}
				</List>
			</div>
		);
				// <List style={{margin: '30px 0'}}>
				// 	{this.props.all.length > 0 && <Subheader inset={true}>All</Subheader>}
				// 	{all}
				// </List>
	}
}

export default createContainer(() => {
	let missionsHandle = Meteor.subscribe('missions.team');
	let submissionsHandle = Meteor.subscribe('submissions.team');

	let team = Meteor.user().team;

	let availableSubmissions = Submissions.find({
		team: team,
		state: {$in: [SubmissionState.OPEN, SubmissionState.SENT]},
	}).fetch();

	let completeSubmissions = Submissions.find({
		team: team,
		state: SubmissionState.APPROVED,
	}).fetch();

	let all = Missions.find({}).fetch();

	let available = Missions.find({
		_id: {$in: _.pluck(availableSubmissions, 'mission')}
	}).fetch();
	let complete = Missions.find({
		_id: {$in: _.pluck(completeSubmissions, 'mission')}
	}).fetch();

	return {
		ready: missionsHandle.ready() && submissionsHandle.ready(),
		all: all,
		available: available,
		complete: complete,
	}
}, MissionsPage);
