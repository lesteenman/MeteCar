import React, { Component } from 'react';

import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { Team } from '/imports/api/Teams.jsx';
import { User } from '/imports/api/Accounts.jsx';
import TeamAvatars from '../../api/TeamAvatars.jsx';

import { InputLine, ActionButton, ExtraButton } from '../ui/UiComponents.jsx';
import ImageUpload from '../ui/ImageUpload.jsx';
import TitledPage from '../ui/TitledPage.jsx';

import Snackbar from 'material-ui/Snackbar';

import '../less/form.scss';

class CreateTeamPage extends TitledPage {
	constructor(props) {
		super(props);

		this.state = {error: {}, snackbar: ''};
		this.submit = this._submit.bind(this);
	}

	getTitle() { return "Manage team"; }

	_submit(id) {
		let team = Team.findOne(id);
		let name = this.refs.name.value();
		let description = this.refs.description.value();
		let avatar = team.avatar;
		if (this.refs.avatar.getFile()) {
			avatar = this.refs.avatar.getFile();
		}
		let result = team.update(name, description, avatar);
		if (result === true) {
			this.setState({
				snackbar: "Opgeslagen.",
			});
		} else {
			this.setState({
				error: result,
			});
		}
	}

	pageRender() {
		let { nameError, descriptionError, error} = this.state.error;

		let captainSection;
		if (this.props.team.captain) {
			if (this.props.team.captain == Meteor.userId()) {
				let members = [];
				this.props.members.forEach(function(member) {
					members.push(
						<li key={member._id}>{member.username}</li>
					);
				});
				captainSection = (
					<div>
						<p>Manage Team Members</p>
						<ul>
							{members}
						</ul>
					</div>
				);
			} else {
				let captain = this.props.captain.username;
				captainSection = (
					<p>Team captain is <i>{captain}</i>. He/she can add and remove users from your team.</p>
				);
			}
		}

		// let avatar = TeamAvatars.findOne({_id: this.props.team.avatar});
		console.log('Team:', this.props.team);

		return (
			<div className='form-container'>
				<InputLine ref='name' label='Team name' value={this.props.team.name} error={nameError} />
				<InputLine ref='description' label='Team description' value={this.props.team.description} multiLine={true} error={descriptionError} />

				<ImageUpload
					ref='avatar'
					collection={TeamAvatars}
					value={this.props.team.avatar}
				/>

				{captainSection}

				<div style={{color: 'red'}}>
					{error}
				</div>

				<Snackbar
					open={!!this.state.snackbar}
					message={this.state.snackbar}
				/>

				{this.props.team.captain == Meteor.userId() ? (
				<div>
					<ActionButton handler={this.submit.bind(this, this.props.team._id)}>Save</ActionButton>
				</div>
				) : ''}
			</div>
		);
	}
}

export default createContainer(() => {
	let team = Team.findOne(User.current().team);
	return {
		team: team,
		captain: team ? User.findOne(team.captain) : undefined,
		members: User.find({team: team._id}).fetch(),
	};
}, CreateTeamPage);
