import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';
import Helmet from 'react-helmet';

import React, { Component } from 'react';
import { Link } from 'react-router';

import '../less/form.scss';

import { ActionButton, ExtraButton, InputLine } from '../ui/UiComponents.jsx';

export default class LoginPage extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {error: {}};
		this.login = this._login.bind(this);
	}

	_login() {
		var email = this.refs.email.value();
		var password = this.refs.password.value();

		Meteor.loginWithPassword(email, password, (error) => {
			if (error) {
				console.log('Error', error);
				if (error.error == 403) {
					this.setState({error: {teamError: error.reason}});
				} else {
					this.setState({error: error});
				}
			}
		});
	}

	render() {
		let {teamError, passwordError, error} = this.state.error;
		return (
			<div className='form-container' style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
				<Helmet title="Login" />
				<InputLine ref='email' onEnter={this.login} label='Email' error={teamError}/>
				<InputLine ref='password' type='password' onEnter={this.login} label='Password' error={passwordError}/>
				<div style={{color: 'red'}}>{error}</div>
				<ActionButton handler={this.login}>Sign In</ActionButton>
				<Link to={'signup'}>
					<ExtraButton>Create User</ExtraButton>
				</Link>
			</div>
		);
	}
}
