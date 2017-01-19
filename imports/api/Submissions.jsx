import { Class, Enum } from 'meteor/jagi:astronomy';
import { User } from './Accounts.jsx';
import { FilesCollection } from 'meteor/ostrio:files';

import { Mission, MissionType } from './Missions.jsx';

export const Submissions = new Mongo.Collection('submissions');
export const SubmissionPhotos = new FilesCollection({
	allowClientCode: false,
	collectionName: 'submission-photos',
	downloadRoute: '/img/submissions',
	storagePath: Meteor.absolutePath + '/../public/submissions/',
	public: true, // TODO: False? Only for those who should see it?
	onBeforeUpload: function(file) {
		if (file.size <= 1024*1024*5 && /png|jpg|jpeg/i.test(file.extension)) {
			return true;
		} else {
			return 'Please upload image, max 5mb';
		}
	},
});

if (Meteor.isServer) {
	Meteor.publish('submission-photos.mission', function(teamId, missionId) {
		let submission = Submission.findOne({
			team: teamId,
			mission: mission,
		});
		let mission = Mission.findOne(missionId);
		console.log('Subscribing to photos for one mission', teamId, missionId, submission._id, submission.data);
		if (submission && submission.data && mission && mission.type == MissionType.PHOTO) {
			return SubmissionPhotos.find(submission.data).cursor;
		}
		return this.ready();
	});
	Meteor.publish('submission-photos.team', function() {
		return SubmissionPhotos.find({}).cursor;
	});
	Meteor.publish('submission-photos.admin.all', function() {
		if (!User.current(this).isAdmin()) return this.ready();
		return SubmissionPhotos.find({}).cursor;
	});
}

export const SubmissionState = Enum.create({
	name: 'SubmissionState',
	identifiers: {
		OPEN: 'open',
		SENT: 'sent',
		APPROVED: 'approved',
	}
});

export const Submission = Class.create({
	name: 'Submission',
	collection: Submissions,
	fields: {
		mission: String,
		state: {
			type: SubmissionState,
			default: 'open',
			optional: true,
		},
		data: {
			type: String,
			optional: true,
		},
		team: String,
	},
	meteorMethods: {
		drop() {
			console.log('Old submission would be dropped', this._id);
			let user = User.current(this);
			if (!(user.team == this.team || user.isAdmin())) return false;
			this.remove();
		},
		open(mission, data) {
			let user = User.current(this);
			console.log('Team opens a submission', mission, data);
			this.state = SubmissionState.OPEN;
			this.team = user.team;
			this.mission = mission;
			this.data = data;
			this.save();
		},
		revoke() {
			console.log('Submission would be revoked', this._id);
			let user = User.current(this);
			if (!(user.team == this.team || user.isAdmin())) return false;
			this.state = SubmissionState.OPEN;
			this.save();
		},
		submit() {
			let mission = Mission.findOne(this.mission);
			this.state = SubmissionState.SENT;
			this.save();
		},
		approve: function() {
			this.state = SubmissionState.APPROVED;
			this.save();
		},
		reject: function() {
			this.state = SubmissionState.OPEN;
			this.save();
		},
	}
});

if (Meteor.isServer) {
	Meteor.publish('submissions.team', function() {
		let user = User.current(this);
		return Submissions.find({team: user.team});
	});
	Meteor.publish('submissions.admin.team', function(team) {
		console.log('Subscribing to team submissions of team', team);
		if (!User.current(this).isAdmin()) return this.ready();
		return Submissions.find({team: team});
	});
	Meteor.publish('submissions.admin.all', function() {
		if (!User.current(this).isAdmin()) return this.ready();
		return Submissions.find();
	});
	Meteor.publish('submissions.admin.photo.all', function() {
		if (!User.current(this).isAdmin()) return this.ready();
		let missions = Mission.find({
			type: MissionType.PHOTO,
		}).fetch();
		let missionIds = _.pluck(missions, '_id');
		return Submissions.find({
			mission: {$in: missionIds}
		});
	});
	Meteor.publish('submissions.photo.all', function() {
		let missions = Mission.find({
			publicResults: true,
			type: MissionType.PHOTO,
		}).fetch();
		let missionIds = _.pluck(missions, '_id');
		return Submissions.find({
			mission: {$in: missionIds},
		});
	});
}
