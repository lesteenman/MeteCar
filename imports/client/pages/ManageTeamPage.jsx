import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { Team } from '../../api/Teams.jsx';

import { InputLine, ActionButton, ExtraButton } from '../ui/UiComponents.jsx';
import ImageUpload from '../ui/ImageUpload.jsx';
import '../less/form.scss';

class CreateTeamPage extends Component {
	constructor(props) {
		super(props);

		this.state = {error: {}};
		this.submit = this._submit.bind(this);
	}

	_submit(id) {
		let team = Team.findOne({_id: id});
		team.name = this.refs.name.value();
		team.description = this.refs.description.value();
		team.save();
	}

	render() {
		if (!this.props.ready) return (<div></div>);

		let { nameError, descriptionError, error} = this.state.error;

		let captainSection;
		if (this.props.team.captain) {
			if (this.props.team.captain == Meteor.userId()) {
				captainSection = (
					<div>Manage Users</div>
				);
			} else {
				let captain = this.props.captain.username;
				captainSection = (
					<div>Team captain is {}. He/she can add and remove users from your team.</div>
				);
			}
		}

		return (
			<div className='form-container'>
				<Helmet title="Manage team" />

				<InputLine ref='name' label='Team name' value={this.props.team.name} error={nameError} />
				<InputLine ref='description' label='Team description' value={this.props.team.description} multiLine={true} error={descriptionError} />
				<div style={{color: 'red'}}>
					{error}
				</div>

				{captainSection}

				<ActionButton handler={this.submit.bind(this, this.props.team._id)}>Save</ActionButton>
				<ExtraButton handler={browserHistory.goBack}>Cancel</ExtraButton>
			</div>
		);
	}
}

export default createContainer(() => {
	let teamHandle = Meteor.subscribe('teams.all');
	let team = Team.findOne({_id: Meteor.user().team});
	return {
		ready: teamHandle.ready(),
		team: team,
		captain: team ? Meteor.users.findOne({_id: team.captain}) : undefined,
	};
}, CreateTeamPage);
