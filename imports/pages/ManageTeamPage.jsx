import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { Team } from '../api/Teams.jsx';

import { InputLine, ActionButton, ExtraButton } from '../ui/UiComponents.jsx';
import '../less/form.scss';

class CreateTeamPage extends Component {
	constructor(props) {
		super(props);

		this.state = {error: {}};
		this.submit = this._submit.bind(this);
	}

	_submit(id) {
		console.log('Update Team', id, this.refs.name.value(), this.refs.description.value());
	}

	render() {
		if (this.props.loading) return (<div></div>);
		let { nameError, descriptionError, error} = this.state.error;

		return (
			<div className='form-container'>
				<Helmet title="Manage team" />

				<InputLine ref='name' label='Team name' value={this.props.team.name} error={nameError} />
				<InputLine ref='description' label='Team description' value={this.props.team.description} multiLine={true} error={descriptionError} />
				<div style={{color: 'red'}}>
					{error}
				</div>

				<ActionButton handler={this.submit.bind(this, this.props.team._id)}>Save</ActionButton>
				<ExtraButton handler={browserHistory.goBack}>Cancel</ExtraButton>
			</div>
		);
	}
}

export default createContainer(() => {
	let teamHandle = Meteor.subscribe('teams.all');
	let team = Team.find({_id: Meteor.user().team});
	return {
		loading: !teamHandle.ready(),
		team: team
	};
}, CreateTeamPage);
