import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createContainer } from 'meteor/react-meteor-data';

import Toggle from 'material-ui/Toggle';
import { Card, CardTitle, CardMedia, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import PopOver from 'material-ui/Popover';

import { isAdmin } from '../../helpers/user.js';
import { Team } from '../../api/Teams.jsx';
import TitledPage from '../ui/TitledPage.jsx';

class AdminTeamPage extends TitledPage {
	constructor(props, context) {
		super(props, context);

		this.handleSetHidden = this._handleSetHidden.bind(this);
		this.handleMemberSelected = this._handleMemberSelected.bind(this);
		this.handleMemberDeselected = this._handleMemberDeselected.bind(this);

		this.state = {
			memberPopoverOpen: false,
		};
	}

	getTitle() { return 'Team'; }
	isReady() { return this.props.ready; }

	pageRender() {
		let team = this.props.team;
		let title = "Team '"+team.name+"'";

		let members = this.getMembers(team);
		let actions = this.getActions(team);

		let details = [];
		if (isAdmin(Meteor.user())) {
			details.push(
				<div key='hidden'>
					Hidden: {team.hidden ? 'yes' : 'no'}
				</div>
			);
		}

		return (
			<Card style={{margin: '20px'}}>
				<CardTitle title={title} />
				<CardMedia>
					<img src=''/>
				</CardMedia>
				<CardText>
					{team.description}
				</CardText>
				<CardText>
					{details}
				</CardText>

				<CardTitle title='Members' />
				{members}

				<CardTitle title='Actions' />
				{actions}
			</Card>
		);
	}

	getActions(team) {
		if (Meteor.user().profile.admin) {
			return (
				<CardText>
					<List>
						<ListItem
							primaryText="delete team"
						>
						</ListItem>
						<Toggle
							toggled={team.hidden}
							onToggle={this.handleSetHidden}
							label="Hidden"
						/>
					</List>
				</CardText>
			);
		} else if (false) { // Team owner
			return (
				<List>
				</List>
			);
		}
		return;
	}

	getMembers(team) {
		let members = [];
		for (let member of this.props.members) {
			members.push(
				<ListItem
					onTouchTap={this.handleMemberSelected}
					key={member.username}
				>
					{member.username}
				</ListItem>
			);
		}
		return (
			<List>
				{members}
				<PopOver
					open={false}
					onRequestClose={this.handleMemberDeselected}
					anchorEl={this.state.selectedMember}
				>
				</PopOver>
			</List>
		);
	}

	_handleMemberSelected(event) {
		this.setState({
			memberPopoverOpen: true,
			selectedMember: event.currentTarget,
		});
	}

	_handleMemberDeselected() {
		this.setState({
			memberPopoverOpen: false,
		});
	}

	_handleSetHidden(event, hidden) {
		this.props.team.setHidden(hidden);
	}
}

export default createContainer((props) => {
	let teamHandler = Meteor.subscribe('teams.all');
	let team = Team.findOne(props.routeParams.id);
	return {
		ready: teamHandler.ready(),
		team: team,
		members: Meteor.users.find({
			team: team._id,
		}).fetch(),
	};
}, AdminTeamPage);
