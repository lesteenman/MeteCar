import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';

class AdminPage extends Component {
	render() {
		if (this.props.user.isAdmin) {
			return (
				<div>
					{this.props.children}
				</div>
			);
		} else {
			return (
				<div style={{color: 'red'}}>
					You are not allowed to view this page.
				</div>
			);
		}
	}
}

export default AdminPageContainer = createContainer(() => {
	return {
		user: Meteor.user()
	};
}, AdminPage);
