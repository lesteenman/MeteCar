import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { InputLine, ActionButton, ExtraButton } from '../ui/UiComponents.jsx';
import '../less/form.scss';
import '../api/Teams.jsx';

class CreateTeamPage extends Component {
	constructor(props) {
		super(props);

		this.state = {error: {}};
		this.submit = this._submit.bind(this);
	}

	cancel() {
		browserHistory.goBack();
	}

	_submit() {
		console.log('Create Team', this.refs.name.value(), this.refs.description.value());
		let name = this.refs.name.value();
		let description = this.refs.description.value();
		Meteor.call('teams.create', name, description, (error) => {
			if (error) {
				console.error('Error:', error);
				let formError = {};
				if (['name', 'description'].indexOf(error.error) >= 0) {
					formError[error.error] = error.reason;
				} else {
					formError.error = error.reason;
				}
				this.setState({error: formError});
			}
		});
	}

	render() {
		// TODO: Add photo
		let {name: nameError, description: descriptionError, error: error} = this.state.error;
		return (
			<div className='form-container'>
				<Helmet title="Create team" />

				<InputLine ref='name' label='Team name' error={nameError} />
				<InputLine ref='description' label='Team description' multiLine={true} error={descriptionError} />
				<div style={{color: 'red'}}>
					{error}
				</div>

				<ActionButton handler={this.submit}>Submit</ActionButton>
				<ExtraButton handler={this.cancel}>Cancel</ExtraButton>
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('teams.all');
	return {};
}, CreateTeamPage);
