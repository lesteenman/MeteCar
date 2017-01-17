import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';

import { Mission, MissionType } from '/imports/api/Missions.jsx';
import { User } from '/imports/api/Accounts.jsx';
import { Submission, SubmissionPhotos } from '/imports/api/Submissions.jsx';

import TitledPage from '../ui/TitledPage.jsx';
import PaperPage from '../ui/PaperPage.jsx';
import MissionMap from '../ui/MissionMap.jsx';
import ImageUpload from '../ui/ImageUpload.jsx';

import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { Card, CardTitle, CardMedia, CardText } from 'material-ui/Card';

class MissionPage extends TitledPage {
	constructor(props, context) {
		super(props, context);
		this.handleSetOpen = this._handleSetOpen.bind(this);
		this.onUpload = this._onUpload.bind(this);
		this.toMap = this._toMap.bind(this);
	}

	getTitle() { return this.props.mission ? this.props.mission.title : ''; }
	isReady() { return this.props.ready && this.props.mission; }

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
				<CardTitle>
					Admin Actions
				</CardTitle>
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
		return (
			<div>
				<ImageUpload
					ref='submission'
					collection={SubmissionPhotos}
					onUpload={this.onUpload}
				/>
				<RaisedButton
					disabled={true}
					label="submit"
				/>
			</div>
		);
	}

	_onUpload(error, fileId) {
		if (error) {
			console.error("Error uploading submission photo", error);
		} else {
			console.log('Received an image:', fileId);
			let submission;
			if (!(submission = Submission.findOne({team: User.current().team, mission: this.props.mission}))) {
				submission = new Submission();
				submission.team = User.current().team;
				submission.mission = this.props.mission;
				submission.save();
			}
			submission.submit(fileId);
		}
	}

	puzzleActions(mission) {
		
	}
}

export default createContainer((props) => {
	let teamHandle = Meteor.subscribe(User.current().isAdmin() ? 'missions.admin.all' : 'missions.team');
	let mission = Mission.findOne({_id: props.routeParams.id});

	let submissionHandle = Meteor.subscribe(User.current().isAdmin() ? 'submissions.admin.all' : 'submissions.team');
	let submissionPhotosHandle = Meteor.subscribe('submission-photos.team');
	let adminSubmissions = Submission.find({mission: props.routeParams.id}).fetch();
	let submissions = Submission.findOne({mission: props.routeParams.id});

	return {
		ready: teamHandle.ready() && submissionHandle.ready() && submissionPhotosHandle.ready() && adminSubmissions.ready(),
		mission: mission,
		adminSubmissions: adminSubmissions,
		submissions: submissions,
	}
}, MissionPage);
