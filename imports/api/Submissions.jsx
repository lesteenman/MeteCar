import { Class, Enum } from 'meteor/jagi:astronomy';
import { User } from './Accounts.jsx';

export const Submissions = new Mongo.Collection('submissions');

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
		},
		'admin.approve': function() {
			console.log('Admin Approves mission', this);
		},
		// 'admin.deny': function() {

		// },
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
