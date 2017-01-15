import React, { Component } from 'react';
import { User } from '/imports/api/Accounts.jsx';
import { createContainer } from 'meteor/react-meteor-data';

class AdminPage extends Component {
	render() {
		let user = User.current();
		if (user && user.isAdmin()) {
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
	return {};
}, AdminPage);
