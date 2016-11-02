import React, { Component } from 'react';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';

import { ActionButton, ExtraButton, InputLine } from './UiComponents.jsx';

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
		var account = {
			email: this.refs.email.value(),
			teamname: this.refs.teamname.value(),
			description: this.refs.description.value(),
			password1: this.refs.password1.value(),
			password2: this.refs.password2.value()
		};
		var me = this;
		Meteor.call('accounts.signup', account, function(error) {
			if (error) {
				console.log('Error', error);
				let errorState = {};
				if (['error', 'email', 'teamname', 'description', 'password1', 'password2'].indexOf(error.error) >= 0) {
					errorState[error.error] = error.reason;
				} else {
					errorState['error'] = error.reason;
				}
				me.setState({'error': errorState});
			}
		});
	}

	render() {
		let {error, email, teamname, description, password1, password2} = this.state.error;
		return (
			<div className='form-container'>
				<InputLine ref='email' onEnter={this.signup} label='Your Email' error={email}/>
				<div>You can add more people later.</div>
				<InputLine ref='teamname' onEnter={this.signup} label='Team Name' error={teamname}/>
				<InputLine ref='description' onEnter={this.signup} multiLine={true} label='Team Description' error={description}/>
				<InputLine ref='password1' type='password' onEnter={this.signup} label='Password' error={password1}/>
				<InputLine ref='password2' type='password' onEnter={this.signup} label='Repeat Password' error={password2}/>
				<div style={{color: 'red'}}>
					{error}
				</div>
				<ActionButton handler={this.signup} text='Submit'/>
				<Link to={'/'}>
					<ExtraButton text='Cancel'/>
				</Link>
			</div>
		);
	}
}
