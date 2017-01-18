import React, { Component } from 'react';
import { User } from '/imports/api/Accounts.jsx';
import { createContainer } from 'meteor/react-meteor-data';

import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

class TeamedUser extends Component {
	componentWillMount() {
		setTimeout(function() {
			Tracker.autorun(function() {
				let userTeamHandle = Meteor.subscribe('users.all');
				let teamHandle = Meteor.subscribe('teams.all');

				console.log('Teamed User autorun', Meteor.loggingIn(), userTeamHandle.ready(), teamHandle.ready());
				if (Meteor.loggingIn() || !userTeamHandle.ready() || !teamHandle.ready()) return;

				let user = User.current();
				if (!user) {
					console.log('User not authenticated; Redirect to login');
					browserHistory.push('/login');
				} else if (user.needsTeam()) {
					console.log('User has no team; Redirect to team-pick');
					browserHistory.push('/team-pick');
				}
			});
		}, 0);
	}

	render() {
		if (!this.props.ready || User.current().needsTeam()) return (<div></div>);

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
	let team = User.current() ? User.current().team : undefined;

	return {
		children: props.children,
		team: team,
		ready: !Meteor.loggingIn() && userTeamHandle.ready() && teamHandle.ready(),
	}; 
}, TeamedUser);
