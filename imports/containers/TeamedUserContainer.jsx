import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

class TeamedUser extends Component {
	componentWillMount() {
		Tracker.autorun(() => {
			let userTeamHandle = Meteor.subscribe('Meteor.users.team');
			if (Meteor.loggingIn() || !userTeamHandle.ready()) return;

			let user = Meteor.user();
			if (!user) {
				console.log('User not authenticated; Redirect to login');
				browserHistory.push('/login');
			} else if (!user.team) {
				console.log('User has no team; Redirect to team-pick');
				browserHistory.push('/team-pick');
			}
		});
	}

	render() {
		if (!this.props.loading && this.props.team) {
			return (
				<div>
					{this.props.children}
				</div>
			);
		}
		return (<div />);
	}
}

TeamedUser.propTypes = {
	children: React.PropTypes.object,
	team: React.PropTypes.string,
	loading: React.PropTypes.bool
};

export default TeamedUserContainer = createContainer((props) => {
	let userTeamHandle = Meteor.subscribe('Meteor.users.team');
	let team = Meteor.user() ? Meteor.user().team : undefined;
	let loggingIn = Meteor.loggingIn();
	let userTeamReady = userTeamHandle.ready();

	return {
		children: props.children,
		team: team,
		loading: loggingIn || !userTeamReady
	}; 
}, TeamedUser);
