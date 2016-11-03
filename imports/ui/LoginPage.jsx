import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';

import React, { Component } from 'react';
import { Link } from 'react-router';

import '../less/form.scss';

import { ActionButton, ExtraButton, InputLine } from './UiComponents.jsx';

export default class LoginPage extends Component {
	constructor(props, context) {
		super(props, context);

		this.login = this._login.bind(this);
	}

	_login() {
		var email = this.refs.email.value();
		var password = this.refs.password.value();

		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				console.log('Error', error);
			} else {
				browserHistory.push('/');
			}
		});
	}

	render() {
		var teamError, passwordError, globalError;
		return (<div className='form-container' style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
			<InputLine ref='email' onEnter={this.login} label='Email' error={teamError}/>
			<InputLine ref='password' type='password' onEnter={this.login} label='Password' error={passwordError}/>
			<div style={{color: 'red'}}>{globalError}</div>
			<ActionButton text='Sign In' handler={this.login} />
			<Link to={'signup'}>
				<ExtraButton text='New Team' />
			</Link>
		</div>);
	}
}
