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
	Meteor.publish('photo-submissions.team', function() {
		return SubmissionPhotos.find().cursor();
	});
	Meteor.publish('photo-submissions.admin.all', function() {
		if (!User.current(this).isAdmin()) return this.ready();
		return SubmissionPhotos.find().cursor();
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
		submit(data) {
			console.log('Team submits', this, data);
			let mission = Mission.findOne({_id: this.mission});
			if (mission.type == MissionType.PHOTO) {
				if (this.data) {
					// Remove any old photos
					let oldPhoto = SubmissionPhotos.findOne(this.data);
					if (oldPhoto) oldPhoto.remove();
				}
				this.data = data;
				this.save();
			} else if (mission.type == MissionType.PUZZLE) {
			}
		},
		'admin.approve': function() {
			console.log('Admin Approves mission', this);
		},
		'admin.reject': function() {
			console.log('Admin Rejects mission', this);
			// TODO: Either move it back to 'OPEN' or 'REJECTED'
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
}
