import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import { Link } from 'react-router';

import { ActionButton, ExtraButton, InputLine } from './UiComponents.jsx';

export default class LoginPage extends Component {
	constructor(props, context) {
		super(props, context);

		this.login = this._login.bind(this);
	}

	_login() {
		var teamname = this.refs.teamname.value();
		var password = this.refs.password.value();
		Meteor.loginWithPassword(teamname, password, (error) => {
			console.log('Error:', error);
		});
	}

	render() {
		var teamError, passwordError, globalError;
		return (<div style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
			<InputLine ref='teamname' onEnter={this.login} label='Team name' error={teamError}/>
			<InputLine ref='password' type='password' onEnter={this.login} label='Password' error={passwordError}/>
			<div style={{color: 'red'}}>{globalError}</div>
			<ActionButton text='Sign In' handler={this.login} />
			<Link to={'signup'}>
				<ExtraButton text='New Team' />
			</Link>
		</div>);
	}
}
