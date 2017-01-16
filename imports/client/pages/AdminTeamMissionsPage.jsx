import React, { Component } from 'react';
import { browserHistory } from 'react-router';
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
		this.setCompleted = this._setCompleted.bind(this);
		this.setNotCompleted = this._setNotCompleted.bind(this);

		this.state = {
			popoverOpened: false,
		};
	}

	getTitle() { return "Missions"; }
	isReady() { return this.props.ready; }

	pageRender() {
		let missions = [];
		let teamId = this.props.team._id;

		this.props.missions.forEach((mission) => {
			missions.push(
				<ListItem
					key={mission._id}
					onTouchTap={this.handleMissionSelected.bind(this, mission, true)}
					primaryText={mission.title}
					secondaryText={mission.isComplete(teamId) ? 'completed' : ''}
				/>
			);
		});
		this.props.unavailableMissions.forEach((mission) => {
			missions.push(
				<ListItem
					key={mission._id}
					onTouchTap={this.handleMissionSelected.bind(this, mission, false)}
					style={{color: '#333'}}
					primaryText={mission.title}
				/>
			);
		});

		let selectedMission = this.state.selectedMission;
		let toMission = function() {
			browserHistory.push('/missions/' + (selectedMission ? selectedMission._id : ''));
		};

		let setCompletedItem, mission;
		if ((mission = this.state.selectedMission) && this.state.selectedMissionAvailable) {
			if (mission.isComplete(teamId)) {
				setCompletedItem = (
					<MenuItem primaryText="set not completed" onTouchTap={this.setNotCompleted.bind(this, selectedMission)}/>
				);
			} else {
				setCompletedItem = (
					<MenuItem primaryText="set completed" onTouchTap={this.setCompleted.bind(this, selectedMission)}/>
				);
			}
		}

		return (
			<div>
				<List>
					{missions}
				</List>
				<PopOver
					open={this.state.popoverOpened}
					onRequestClose={this.handleMissionDeselected}
					anchorEl={this.state.selectedMissionEl}
				>
					<Menu>
						{setCompletedItem}
						<MenuItem
							primaryText="view mission"
							onTouchTap={toMission}
						/>
					</Menu>
				</PopOver>
			</div>
		);
	}

	_setCompleted() {
		this.state.selectedMission.setCompleted(this.props.team._id, true);
		this.setState({
			popoverOpened: false,
		});
	}

	_setNotCompleted() {
		this.state.selectedMission.setCompleted(this.props.team._id, false);
		this.setState({
			popoverOpened: false,
		});
	}

	_handleMissionSelected(mission, available, event) {
		let el = event.currentTarget;
		this.setState({
			popoverOpened: true,
			selectedMissionEl: el,
			selectedMission: mission,
			selectedMissionAvailable: available,
		});
		return event.nativeEvent.preventDefault();
	}

	_handleMissionDeselected(e) {
		this.setState({
			popoverOpened: false,
		});
	}
}

export default createContainer((props) => {
	let teamHandler = Meteor.subscribe('teams.all');
	let team = Team.findOne(props.routeParams.id);
	let missionIds = team.getMissions();
	console.log('MissionIds', missionIds);

	let submissionsHandler = Meteor.subscribe('submissions.admin.team', team._id);

	let missionHandler = Meteor.subscribe('missions.admin.all');
	let missions = Mission.find({
		_id: {$in: missionIds}
	}).fetch();

	let unavailableMissions = Mission.find({
		_id: {$nin: missionIds}
	}).fetch();

	return {
		ready: submissionsHandler.ready() && missionHandler.ready() && teamHandler.ready(),
		team: team,
		missions: missions,
		// submissions: submissions,
		unavailableMissions: unavailableMissions,
	};
}, AdminTeamMissionsPage);
