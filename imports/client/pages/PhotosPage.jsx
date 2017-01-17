import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Mission, MissionType } from '/imports/api/Missions.jsx';
import { User } from '/imports/api/Accounts.jsx';
import { Team } from '/imports/api/Teams.jsx';
import { Submission, SubmissionState, SubmissionPhotos } from '/imports/api/Submissions.jsx';

import PaperPage from '../ui/PaperPage.jsx';
import TitledPage from '../ui/TitledPage.jsx';

import PopOver from 'material-ui/Popover';
import { Menu, MenuItem } from 'material-ui/Menu';

import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import CheckIcon from 'material-ui/svg-icons/av/playlist-add-check';

class PhotosPage extends TitledPage {
	constructor(props, context) {
		super(props, context);

		this.handlePhotoSelected = this._handlePhotoSelected.bind(this);
		this.handlePhotoDeselected = this._handlePhotoDeselected.bind(this);
		this.onSubmissionApprove = this._onSubmissionApprove.bind(this);
		this.onSubmissionReject = this._onSubmissionReject.bind(this);

		this.state = {
			popoverOpened: false,
		};
	}

	getTitle() { return  "photos"; }
	isReady() { return this.props.ready; }

	pageRender() {
		let user = User.current();
		let lists = [];

		this.props.missions.forEach((mission) => {
			let photos = [];
			let submissions = Submission.find({
				mission: mission._id,
			}).fetch();

			submissions.forEach((submission) => {
				let image = SubmissionPhotos.findOne({_id: submission.data});
				if (image) {
					let team = Team.findOne({_id: submission.team});
					let adminIcon, subtitle, titleStyle;
					if (user.isAdmin()) {
						switch (submission.state) {
							case SubmissionState.OPEN:
								subtitle = 'open';
								titleStyle = {
									color: '#B0BEC5'
								}
								break;
							case SubmissionState.SENT:
								subtitle = 'pending';
								titleStyle = {
									fontWeight: 'bold'
								}
								break;
							case SubmissionState.APPROVED:
								subtitle = 'approved';
								titleStyle = {
									color: '#4CAF50'
								}
								break;
						}
						adminIcon = (
							<IconButton><CheckIcon onTouchTap={this.handlePhotoSelected.bind(this, submission)}/></IconButton>
						);
					}
					photos.push(
						<GridTile
							key={submission._id}
							title={team.name}
							subtitle={subtitle}
							titleStyle={titleStyle}
							actionIcon={adminIcon}
							onTouchTap={console.log('requesting to view photo', image._id)}
						>
							<img src={image.link()} />
						</GridTile>
					);
				}
			});
			lists.push(
				<div
					style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}
					key={mission._id}
				>
					<h2>{mission.title}</h2>
					<GridList
						style={{display: 'flex', flexWrap: 'nowrap', overflowX: 'auto'}}
					>
						{photos}
					</GridList>
				</div>
			);
		});


		let popover;
		let selectedSubmission = this.state.selectedSubmission;
		if (user.isAdmin()) {
			let setApprovedItem, setRejectedItem;
			if (selectedSubmission) {
				if (selectedSubmission.state != SubmissionState.APPROVED) {
					setApprovedItem = (
						<MenuItem
							primaryText="Approve"
							onTouchTap={this.onSubmissionApprove.bind(this, selectedSubmission)}
						/>
					);
				} else if (selectedSubmission.state != SubmissionState.OPEN) {
					setRejectedItem = (
						<MenuItem
							primaryText="Reject"
							onTouchTap={this.onSubmissionReject.bind(this, selectedSubmission)}
						/>
					);
				}
			}
			popover = (
				<PopOver
					open={this.state.popoverOpened}
					onRequestClose={this.handlePhotoDeselected}
					anchorEl={this.state.selectedPhotoEl}
				>
					<Menu>
						{setApprovedItem}
						{setRejectedItem}
					</Menu>
				</PopOver>
			);
		}

		return (
			<div>
				{lists}
				{popover}
			</div>
		);
	}

	_onSubmissionApprove(submission) {
		submission.approve();
		this.setState({
			popoverOpened: false,
			selectedSubmission: undefined,
		});
	}

	_onSubmissionReject(submission) {
		submission.reject();
		this.setState({
			popoverOpened: false,
			selectedSubmission: undefined,
		});
	}

	_handlePhotoSelected(submission, event) {
		console.log('Selected submission photo:', submission);
		this.setState({
			popoverOpened: true,
			selectedPhotoEl: event.currentTarget,
			selectedSubmission: submission,
		});
		return event.nativeEvent.preventDefault();
	}
	
	_handlePhotoDeselected(event) {
		this.setState({
			popoverOpened: false,
			selectedSubmission: undefined,
		});
	}
}

export default createContainer((props) => {
	let user = User.current();
	let submissionsHandle = Meteor.subscribe(user.isAdmin() ? 'submissions.admin.photo.all' : 'submissions.photo.all');
	let missionsHandle = Meteor.subscribe(user.isAdmin() ? 'missions.admin.all' : 'missions.team');
	let photosHandle = Meteor.subscribe(user.isAdmin() ? 'submission-photos.admin.all' : 'submission-photos.team');

	let missions = Mission.find({
		type: MissionType.PHOTO,
	}).fetch();
	let submissions = Submission.find({
		mission: {$in: _.pluck(missions, '_id')},
		state: {$in: [SubmissionState.APPROVED, SubmissionState.SENT]},
	}).fetch();
	return {
		ready: submissionsHandle.ready() && missionsHandle.ready() && photosHandle.ready(),
		missions: missions,
	};
}, PhotosPage);
