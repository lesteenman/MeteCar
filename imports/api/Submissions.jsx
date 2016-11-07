import { Class, Enum } from 'meteor/jagi:astronomy';

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
			default: SubmissionState.open,
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
		let user = Meteor.users.find({_id: this.userId});
		let team = user.team;
		return Submissions.find({team: team});
	});
	// Meteor.publish('submissions.admin.all', function() {

	// });
}
