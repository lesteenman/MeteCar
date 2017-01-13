import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

class UnteamedUser extends Component {
	componentWillMount() {
		setTimeout(function() {
			Tracker.autorun(function() {
				let userTeamHandle = Meteor.subscribe('users.all');
				if (Meteor.loggingIn() || !userTeamHandle.ready()) return;

				let user = Meteor.user();
				console.log('Unteamed container', user);

				if (!user) {
					console.log('User not authenticated; Redirect to login');
					browserHistory.push('/login');
				} else if (user.profile.admin || user.team) {
					console.log('User has a team; Redirect to dashboard');
					browserHistory.push('/dashboard');
				}
			});
		}, 0);
	}

	render() {
		if (!this.props.loading && !this.props.team) {
			return (
				<div>
					{this.props.children}
				</div>
			);
		}
		return (<div />);
	}
}

UnteamedUser.propTypes = {
	children: React.PropTypes.object,
	team: React.PropTypes.string,
	loading: React.PropTypes.bool
};

export default UnteamedUserContainer = createContainer((props) => {
	let userTeamHandle = Meteor.subscribe('users.all');
	let team = Meteor.user() ? Meteor.user().team : undefined;
	let loggingIn = Meteor.loggingIn();
	let userTeamReady = userTeamHandle.ready();

	return {
		children: props.children,
		team: team,
		loading: loggingIn || !userTeamReady
	};
}, UnteamedUser);
