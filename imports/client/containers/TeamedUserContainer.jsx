import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

import { needsTeam } from '../../helpers/user.js'

class TeamedUser extends Component {
	componentWillMount() {
		setTimeout(function() {
			Tracker.autorun(function() {
				let userTeamHandle = Meteor.subscribe('users.all');
				let teamHandle = Meteor.subscribe('teams.all');

				if (Meteor.loggingIn() || !userTeamHandle.ready() || !teamHandle.ready()) return;

				let user = Meteor.user();
				if (!user) {
					console.log('User not authenticated; Redirect to login');
					browserHistory.push('/login');
				} else if (needsTeam(user)) {
					console.log('User has no team; Redirect to team-pick');
					browserHistory.push('/team-pick');
				}
			});
		}, 0);
	}

	render() {
		if (!this.props.ready || needsTeam(Meteor.user())) return (<div></div>);

		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

TeamedUser.propTypes = {
	children: React.PropTypes.object,
	team: React.PropTypes.string,
	loading: React.PropTypes.bool
};

export default TeamedUserContainer = createContainer((props) => {
	let userTeamHandle = Meteor.subscribe('users.all');
	let teamHandle = Meteor.subscribe('teams.all');
	let team = Meteor.user() ? Meteor.user().team : undefined;

	return {
		children: props.children,
		team: team,
		ready: !Meteor.loggingIn() && userTeamHandle.ready() && teamHandle.ready(),
	}; 
}, TeamedUser);
