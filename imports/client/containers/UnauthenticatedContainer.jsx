import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

import { User } from '/imports/api/Accounts.jsx';

class Unauthenticated extends Component {
	componentWillMount() {
		setTimeout(function() {
			Tracker.autorun(() => {
				if (User.current()) {
					console.log('User is authenticated; Redirect to dashboard');
					browserHistory.push('/dashboard');
				}
			});
		}, 0);
	}

	render() {
		if (!Meteor.loggingIn() && !User.current()) {
			return (
				<div>
					{this.props.children}
				</div>
			);
		}
		return (<div />);
	}
}

export default UnauthenticatedContainer = createContainer(() => {
	return {};
}, Unauthenticated);
