import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createContainer } from 'meteor/react-meteor-data';

import { Mission, MissionType } from '../../api/Missions.jsx';
import TitledPage from '../ui/TitledPage.jsx';
import PaperPage from '../ui/PaperPage.jsx';
import { isAdmin } from '../../helpers/user.js';

import Toggle from 'material-ui/Toggle';
import { Card, CardTitle, CardMedia, CardText } from 'material-ui/Card';

class MissionPage extends TitledPage {
	constructor(props, context) {
		super(props, context);
		this.handleSetOpen = this._handleSetOpen.bind(this);
	}

	getTitle() { return this.props.mission ? this.props.mission.title : ''; }
	isReady() { return this.props.ready; }

	pageRender() {
		console.log('Mission:', this.props.mission);
		let mission = this.props.mission;

		let top;
		if (mission.type == MissionType.LOCATION) {
			top = (
				<CardMedia>
					<div>
						Hier komt een kaart
					</div>
				</CardMedia>
			);
		}

		let actions;
		if (isAdmin(Meteor.user())) {
			actions = this.adminActions();
		} else {
			// Get actions based on the card type
		}

		return (
			<PaperPage>
				{top}
				<CardText>
					{mission.description}
				</CardText>
				{actions}
			</PaperPage>
		);
	}

	_handleSetOpen(event, open) {
		this.props.mission.setOpen(open, (err, result) => {
			if (err) console.error('Error while setting mission.open:', err);
			else if (result != 1) console.error('Unexpected response while saving mission:', result);
		});

		// TODO: How will people now get this mission in their list? Should we maybe not
		// work with 'open' submissions , but with a fake 'subcription' that has the logic
		// of which missions are currently available for a team?
	}

	adminActions() {
		return (
			<div>
				<CardTitle>
					Admin Actions
				</CardTitle>
				<CardText>
					<Toggle
						toggled={this.props.mission.open}
						onToggle={this.handleSetOpen}
						label="Open"
					/>
				</CardText>
			</div>
		);
	}
}

export default createContainer((props) => {
	let teamHandle = Meteor.subscribe('missions.team');
	let mission = Mission.findOne({_id: props.routeParams.id});

	return {
		ready: teamHandle.ready(),
		mission: mission,
	}
}, MissionPage);
