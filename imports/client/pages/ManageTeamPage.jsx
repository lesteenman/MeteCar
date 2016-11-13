import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import { browserHistory } from 'react-router';

import { Team } from '../../api/Teams.jsx';
import TeamAvatars from '../../api/TeamAvatars.jsx';

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
		this.refs.avatar.upload(function(result) {
			if (result) {
				if (result !== true) {
					team.avatar = result;
				}
				team.save();
			} else {
				console.error('Uploading Failed');
			}
		});
	}

	render() {
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

		let avatar, avatarUrl;
		if (avatar = TeamAvatars.findOne(this.props.team.avatar)) {
			avatarUrl = avatar.link();
		}

		return (
			<div className='form-container'>
				<Helmet title="Manage team" />

				<InputLine ref='name' label='Team name' value={this.props.team.name} error={nameError} />
				<InputLine ref='description' label='Team description' value={this.props.team.description} multiLine={true} error={descriptionError} />

				<ImageUpload
					ref='avatar'
					collection={TeamAvatars}
					file={avatarUrl}
				/>

				{captainSection}

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
	let team = Team.findOne({_id: Meteor.user().team});
	return {
		team: team,
		captain: team ? Meteor.users.findOne({_id: team.captain}) : undefined,
		members: Meteor.users.find({team: team._id}).fetch(),
	};
}, CreateTeamPage);
