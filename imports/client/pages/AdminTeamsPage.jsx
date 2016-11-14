import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem } from 'material-ui/List';

import { Teams } from '../../api/Teams.jsx';

class AdminDashboardPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);

		let teams = [];
		this.props.teams.forEach(function(team) {
			let link = '/admin/teams/' + team._id;
			teams.push(
				<Link to={link} key={team._id}>
					<ListItem
						primaryText={team.name}
					/>
				</Link>
			);
		});

		return (
			<div>
				<Helmet title="Admin - Teams" />
				<List>
					{teams}
				</List>
			</div>
		);
	}
}

export default createContainer(() => {
	let teamHandler = Meteor.subscribe('teams.all');
	return {
		ready: teamHandler.ready(),
		teams: Teams.find().fetch(),
	};
}, AdminDashboardPage);
