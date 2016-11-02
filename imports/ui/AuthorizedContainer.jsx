import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { browserHistory } from 'react-router';

class UserPage extends Component {
	render() {
		if (this.props.userId) {
			let props = {
				user: this.props.user,
				userId: this.props.userId
			};
			return (
				<div>
					{React.cloneElement(this.props.children, props)}
				</div>
			);
		} else {
			return (
				<div>
					<LoginPage />
				</div>
			);
		}
	}
}

class AdminPage extends Component {
	render() {
		if (this.props.user.isAdmin) {
			let props = {
				user: this.props.user,
				userId: this.props.userId
			};
			return (
				<div>
					{React.cloneElement(this.props.children, props)}
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

class UnauthorizedPage extends Component {
	render() {
		if (this.props.userId) {
			browserHistory.push('/');
		}
		return (
			<div>
				<LoginPage />
			</div>
		);
	}
}
