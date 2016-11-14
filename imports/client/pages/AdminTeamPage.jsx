import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createContainer } from 'meteor/react-meteor-data';

import { List, ListItem } from 'material-ui/List';

import { Teams } from '../../api/Teams.jsx';

class AdminTeamPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);

		let title = "Team '"+this.props.team.name+"'";

		return (
			<div>
				<Helmet title={title}/>
				<h2>Missions</h2>
				<List>
					<ListItem
						primaryText='Mission Title'
						secondaryText='Mission State'
					/>
				</List>

				<h2>Admin Actions</h2>
				<List>
					<ListItem
						primaryText='Start first mission'
						secondaryText='Only works if team has no open missions'
					/>
				</List>
			</div>
		);
	}
}

export default createContainer((props) => {
	let teamHandler = Meteor.subscribe('teams.all');
	return {
		ready: teamHandler.ready(),
		team: Teams.findOne(props.routeParams.id),
	};
}, AdminTeamPage);
