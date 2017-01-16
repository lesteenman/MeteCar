import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem } from 'material-ui/List';
import PopOver from 'material-ui/Popover';
import { Menu, MenuItem } from 'material-ui/Menu';

import { Team } from '/imports/api/Teams.jsx';
import { Mission } from '/imports/api/Missions.jsx';
import { Submission } from '/imports/api/Submissions.jsx';
import TitledPage from '../ui/TitledPage.jsx';

class AdminTeamMissionsPage extends TitledPage {
	constructor(props, context) {
		super(props, context);

		this.handleMissionSelected = this._handleMissionSelected.bind(this);
		this.handleMissionDeselected = this._handleMissionDeselected.bind(this);

		this.state = {
			popoverOpened: false,
		};
	}

	getTitle() { return "Missions"; }
	isReady() { return this.props.ready; }

	pageRender() {
		let missions = [];

		console.log('Missions', this.props.missions);

		this.props.missions.forEach((mission) => {
			missions.push(
				<ListItem key={mission._id} onTouchTap={this.handleMissionSelected}>
					{mission.title}
				</ListItem>
			);
		});

		return (
			<div>
				<List>
					{missions}
				</List>
				<PopOver
					open={this.state.popoverOpened}
					onRequestClose={this.handleMissionDeselected}
					anchorEl={this.state.selectedMission}
				>
					<Menu>
						<MenuItem primaryText="set completed"/>
						<MenuItem primaryText="set not completed"/>
						<MenuItem primaryText="view mission"/>
					</Menu>
				</PopOver>
			</div>
		);
	}

	_handleMissionSelected(event) {
		this.setState({
			popoverOpened: true,
			selectedMission: event.currentTarget,
		});
	}

	_handleMissionDeselected() {
		this.setState({
			popoverOpened: false,
		});
	}
}

export default createContainer((props) => {
	let teamHandler = Meteor.subscribe('teams.all');
	let team = Team.findOne(props.routeParams.id);
	let missionIds = team.getMissions();
	console.log('mission ids', missionIds);

	let submissionsHandler = Meteor.subscribe('submissions.admin.team', team.id);
	let submissions = Submission.find({
		mission: {$in: missionIds}
	}).fetch();

	let missionHandler = Meteor.subscribe('missions.admin.all');
	let missions = Mission.find({
		_id: {$in: missionIds}
	}).fetch();
	return {
		ready: submissionsHandler.ready() && missionHandler.ready() && teamHandler.ready(),
		team: team,
		missions: missions,
		submissions: submissions,
	};
}, AdminTeamMissionsPage);
