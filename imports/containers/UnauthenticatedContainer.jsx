import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

class Unauthenticated extends Component {
	componentWillMount() {
		Tracker.autorun(() => {
			if (Meteor.user()) {
				browserHistory.push('/dashboard');
			}
		});
	}

	render() {
		if (!Meteor.loggingIn() && !this.props.user) {
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
	return {
		user: Meteor.user()
	};
}, Unauthenticated);
