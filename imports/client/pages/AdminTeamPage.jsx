import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem } from 'material-ui/List';

import { Teams } from '../../api/Teams.jsx';

class AdminTeamPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);

		let team = this.props.team;
		let title = "Team '"+team.name+"'";

		let members = this.getMembers(team);
		let actions = this.getActions(team);

		return (
			<div>
				<Helmet title={title}/>
				<table>
					<tbody>
						<tr>
							<td>description</td><td>{team.description}</td>
						</tr>
						<tr>
							<td>hidden</td><td>{team.hidden ? 'yes' : 'no'}</td>
						</tr>
					</tbody>
				</table>

				<h2>Members</h2>
				{members}

				{actions}
			</div>
		);
	}

	getActions(team) {
		if (Meteor.user().profile.admin) {
			return (
				<List>
					<ListItem
						primaryText="delete team"
					>
					</ListItem>
					<ListItem
						primaryText="toggle hidden"
						secondaryText={"currently: " + team.hidden ? "yes" : "no"}
					>
					</ListItem>
				</List>
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
		let members = '';
		console.log('Members: ', this.props.members);
		for (let member of this.props.members) {
			console.log('Member: ', member);
		}
		return members;
	}
}

export default createContainer((props) => {
	let teamHandler = Meteor.subscribe('teams.all');
	let team = Teams.findOne(props.routeParams.id);
	return {
		ready: teamHandler.ready(),
		team: team,
		members: Meteor.users.find({
			profile: {
				team: team._id,
			}
		}).fetch(),
	};
}, AdminTeamPage);
