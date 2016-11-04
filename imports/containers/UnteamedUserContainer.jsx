import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

class UnteamedUser extends Component {
	componentWillMount() {
		Tracker.autorun(() => {
			let user = Meteor.user();
			if (user && user.profile.team) {
				browserHistory.push('/dashboard');
			}
		});
	}

	render() {
		if (!Meteor.loggingIn() && !this.props.team) {
			return (
				<div>
					{this.props.children}
				</div>
			);
		}
		return (<div />);
	}
}

export default UnteamedUserContainer = createContainer(() => {
	let user = Meteor.user();
	let team;
	if (user) team = user.profile.team;
	return {
		team: team
	};
}, UnteamedUser);
