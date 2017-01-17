import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { Mission, MissionType } from '/imports/api/Missions.jsx';
import { User } from '/imports/api/Accounts.jsx';
import { Team } from '/imports/api/Teams.jsx';
import { Submission, SubmissionState, SubmissionPhotos } from '/imports/api/Submissions.jsx';

import TitledPage from '../ui/TitledPage.jsx';
import PaperPage from '../ui/PaperPage.jsx';
import MissionMap from '../ui/MissionMap.jsx';
import ImageUpload from '../ui/ImageUpload.jsx';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { Card, CardTitle, CardMedia, CardText } from 'material-ui/Card';

class MissionPage extends TitledPage {
	constructor(props, context) {
		super(props, context);
		this.handleSetOpen = this._handleSetOpen.bind(this);
		this.onUpload = this._onUpload.bind(this);
		this.onSubmit = this._onSubmit.bind(this);
		this.onRevoke = this._onRevoke.bind(this);
		this.toMap = this._toMap.bind(this);
	}

	getTitle() { return this.props.mission ? this.props.mission.title : ''; }
	isReady() {
		return this.props.ready && this.props.mission;
	}

	_toMap() {
		console.log('Would now navigate to the map and zoom on mission', this.props.mission._id);
	}

	pageRender() {
		let mission = this.props.mission;

		let top;
		if (mission.type == MissionType.LOCATION) {
			top = (
				<Link to={'/map/mission/' + mission._id}>
					<CardMedia style={{height: '200px'}} >
						<MissionMap
							missions={[mission]}
							allowZooming={false}
							allowPanning={false}
						/>
					</CardMedia>
				</Link>
			);
		}

		let actions;
		if (User.current().isAdmin()) {
			actions = this.adminActions();
		} else {
			if (mission.type == MissionType.PHOTO) {
				actions = this.photoActions(mission);
			} else if (mission.type == MissionType.PUZZLE) {
				actions = this.puzzleActions(mission);
			}
		}

		return (
			<PaperPage>
				{top}
				<CardText>
					{mission.description}
				</CardText>
				{actions}
			</PaperPage>
		);
	}

	_handleSetOpen(event, open) {
		this.props.mission.setOpen(open, (err, result) => {
			if (err) console.error('Error while setting mission.open:', err);
			else if (result != 1) console.error('Unexpected response while saving mission:', result);
		});
	}

	adminActions() {
		return (
			<div>
				<Divider />
				<Subheader>Admin Actions</Subheader>
				<CardText>
					<Toggle
						toggled={this.props.mission.open}
						onToggle={this.handleSetOpen}
						label="Open"
					/>
				</CardText>
			</div>
		);
	}

	photoActions(mission) {
		let submission = this.props.submission;
		console.log('Submission', submission);
		if (submission && submission.state == SubmissionState.SENT) {
			let image = SubmissionPhotos.findOne({_id: submission.data});
			return (
				<div>
					<img src={image ? image.link() : image} style={{maxWidth: '100%'}}/>
					<RaisedButton
						disabled={!(submission && submission.state == SubmissionState.SENT)}
						label="revoke submission"
						onTouchTap={this.onRevoke}
					/>
				</div>
			);
		} else {
			return (
				<div>
					<ImageUpload
						ref='submission'
						value={submission ? submission.data : undefined}
						collection={SubmissionPhotos}
						onUpload={this.onUpload}
					/>
					<RaisedButton
						disabled={!(submission && submission.state == SubmissionState.OPEN)}
						label="submit"
						onTouchTap={this.onSubmit}
					/>
				</div>
			);
		}
	}

	_onUpload(error, fileId) {
		if (error) {
			console.error("Error uploading submission photo", error);
		} else {
			console.log('Received an image:', fileId);
			let submission;
			if (submission = Submission.findOne({team: User.current().team, mission: this.props.mission._id})) {
				console.log('Dropping an old submission');
				submission.drop();
			}
			console.log('Opening a new submission');
			submission = new Submission();
			submission.open(this.props.mission._id, fileId);
		}
	}

	_onSubmit() {
		let submission = this.props.submission;
		if (submission) submission.submit();
	}

	_onRevoke() {
		let submission = this.props.submission;
		if (submission) submission.revoke();
	}

	puzzleActions(mission) {
		
	}
}

export default createContainer((props) => {
	let user = User.current();
	console.log('User:', user.isAdmin(), user.team);

	let teamHandle = Meteor.subscribe(user.isAdmin() ? 'missions.admin.all' : 'missions.team');
	let mission = Mission.findOne({_id: props.routeParams.missionId});

	let submissionHandle = Meteor.subscribe(user.isAdmin() ? 'submissions.admin.all' : 'submissions.team');
	// let submissionPhotosHandle = Meteor.subscribe('submission-photos.mission', user.team, props.routeParams.missionId);
	let submissionPhotosHandle = Meteor.subscribe('submission-photos.team');
	let adminSubmissions = Submission.find({mission: props.routeParams.missionId}).fetch();
	let submission = Submission.findOne({mission: props.routeParams.missionId, team: user.team});

	return {
		ready: teamHandle.ready() && submissionHandle.ready() && submissionPhotosHandle.ready(),
		mission: mission,
		adminSubmissions: adminSubmissions,
		submission: submission,
	}
}, MissionPage);
