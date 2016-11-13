import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import { Accounts } from 'meteor/accounts-base';

import { ActionButton, ExtraButton, InputLine } from '../ui/UiComponents.jsx';

import '../less/form.scss';

export default class SignupPage extends Component {
	constructor(props, context) {
		super(props, context);

		this.signup = this._signup.bind(this);
		this.state = {
			error: ''
		};
	}

	_signup() {
		let username = this.refs.username.value(),
			email = this.refs.email.value(),
			password1 = this.refs.password1.value(),
			password2 = this.refs.password2.value();
		Meteor.call('accounts.signup', username, email, password1, password2, (error, result) => {
			if (error) {
				console.log('Error', error);
				let errorState = {};
				if (['error', 'email', 'password1', 'password2'].indexOf(error.error) >= 0) {
					errorState[error.error] = error.reason;
				} else {
					errorState['error'] = error.reason;
				}
				this.setState({'error': errorState});
			} else {
				console.log('Account Created', result);
				Meteor.loginWithPassword(email, password1);
			}
		});
	}

	render() {
		let {error, username: usernameError, email: emailError, password1: password1Error, password2: password2Error} = this.state.error;
		return (
			<div className='form-container'>
				<Helmet title="Signup" />
				<InputLine ref='username' capitalize={false} onEnter={this.signup} label='Username' error={usernameError}/>
				<InputLine ref='email' type='email' onEnter={this.signup} label='Your Email' error={emailError}/>
				<InputLine ref='password1' type='password' onEnter={this.signup} label='Password' error={password1Error}/>
				<InputLine ref='password2' type='password' onEnter={this.signup} label='Repeat Password' error={password2Error}/>
				<div style={{color: 'red'}}>
					{error}
				</div>
				<ActionButton handler={this.signup}>Submit</ActionButton>
				<Link to={'/'}>
					<ExtraButton>Cancel</ExtraButton>
				</Link>
			</div>
		);
	}
}
