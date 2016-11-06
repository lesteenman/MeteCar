import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createContainer } from 'meteor/react-meteor-data';

import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';

import { Missions } from '../api/Missions.jsx';
// import { Submissions } from '../api/Submissions.jsx';

class MissionsPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);

		let unavailable = [];
		console.log('Unavailable: ', unavailable);
		for (let i = 0; i < this.props.unavailable.length; i++) {
			let mission = this.props.unavailable[i];
			unavailable.push(
				<ListItem
					primaryText={mission.title}
					secondaryText={mission.description}
				/>
			);
		}

		let available = [];
		let complete = [];
		return (
			<div>
				<Helmet title='Missions' />
				<List style={{margin: '10px 0'}}>
					{this.props.unavailable.length > 0 && <Subheader inset={true}>Unavailable</Subheader>}
					{unavailable}
				</List>
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

	return {
		ready: missionsHandle.ready(), // && submissionsHandle.ready(),
		unavailable: Missions.find({}).fetch(), // TODO: Filter based on submission status
		available: [],
		complete: []
	}
}, MissionsPage);
