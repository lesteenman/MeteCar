import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import TeamAvatars from '../../api/TeamAvatars.jsx';
import { Team } from '../../api/Teams.jsx';
import TitledPage from '/imports/client/ui/TitledPage.jsx';

class AdminTeamsPage extends TitledPage {
	isReady() { return this.props.ready; }
	getTitle() { return "Admin - Teams"; }

	pageRender() {
		let teams = [];
		for (let team of this.props.teams) {
			let link = '/admin/teams/' + team._id;
			let avatar = TeamAvatars.findOne({_id: team.avatar});
			teams.push(
				<Link to={link} key={team._id}>
					<ListItem
						primaryText={team.name}
						rightAvatar={avatar ? <Avatar src={avatar.link()} /> : undefined}
					/>
				</Link>
			);
		};

		return (
			<List>
				{teams}
			</List>
		);
	}
}

export default createContainer(() => {
	let teamHandler = Meteor.subscribe('teams.all');
	return {
		ready: teamHandler.ready(),
		teams: Team.find().fetch(),
	};
}, AdminTeamsPage);
