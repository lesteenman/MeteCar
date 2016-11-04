import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

class TeamedUser extends Component {
	componentWillMount() {
		Tracker.autorun(() => {
			if (Meteor.loggingIn()) return;

			let user = Meteor.user();
			if (!user) {
				browserHistory.push('/login');
			} else if (!user.profile.team) {
				browserHistory.push('/pickTeam');
			}
		});
	}

	render() {
		if (!Meteor.loggingIn() && this.props.team) {
			return (
				<div>
					{this.props.children}
				</div>
			);
		}
		return (<div />);
	}
}

export default TeamedUserContainer = createContainer(() => {
	let user = Meteor.user();
	let team;
	if (user) team = user.profile.team;
	console.log('Creating Container', user, team);
	return {
		team: team
	};
}, TeamedUser);
