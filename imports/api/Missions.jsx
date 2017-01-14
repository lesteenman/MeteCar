import { Class, Enum } from 'meteor/jagi:astronomy';
import { isAdmin } from '../helpers/user.js';
import { Submissions, SubmissionState } from './Submissions.jsx';

export const Missions = new Mongo.Collection('missions');

export const MissionType = Enum.create({
	name: 'MissionType',
	identifiers: {
		LOCATION: 'location',
		PHOTO: 'photo',
		PUZZLE: 'puzzle',
	}
});

export const Mission = Class.create({
	name: 'Missions',
	collection: Missions,
	fields: {
		title: String,
		description: String,
		type: MissionType,
		order: Number,
		optional: Boolean,
		open: {
			type: Boolean,
			default: false,
		},
		lat: {
			type: Number,
			optional: true
		},
		lng: {
			type: Number,
			optional: true
		},
		answer: {
			type: String,
			optional: true
		},
		// trigger: {
			
		// },
	},
	indexes: {
		priority: {
			fields: { order: 1 },
			options: { unique: true },
		}
	},
	meteorMethods: {
		setOpen(open) {
			if (!isAdmin(Meteor.user())) return false;

			this.open = open;
			return this.save();
		},
	},
});

if (Meteor.isServer) {
	// missions.admin.all
	// missions.team
	Meteor.publish('missions.team', function() {
		// PUBLISH:
		// - All open optional missions
		// - All missions with a submission
		// - The first required, open mission after the last accepted submission

		let userId = this.userId;
		let user = Meteor.users.findOne({_id: userId});
		let team = user.team;
		if (!team) {
			this.ready();
			return false;
		}

		let availableIds = [];

		/**
		 * Any mission with an open submission
		 */
		let teamSubmissions = Submissions.find({
			team: team,
		}).fetch();

		availableIds.push({_id: {$in: _.pluck(teamSubmissions, 'mission')}});

		/**
		 * The first mission after the last approved submission
		 */
		// Approved missions
		let approved = Submissions.find({
			team: team,
			state: SubmissionState.APPROVED,
		}).fetch();

		// Get which of these is the last in order
		let lastFinished = Missions.findOne({
			optional: false,
			_id: {$in: _.pluck(approved, 'mission')}
		}, {
			sort: {order: -1},
			limit: 1,
		});
		let lastFinishedOrder = lastFinished ? lastFinished.order : 0;

		// Get the first open mission with an order greater than the last (or 0)
		let nextOpen = Missions.findOne({
			order: {$gt: lastFinishedOrder}
		}, {
			sort: {order: 1},
			limit: 1
		});
		if (nextOpen) availableIds.push({_id: nextOpen._id});

		/**
		 * Open optional missions
		 */
		let openOptional = Missions.find({
			optional: true,
			open: true,
		}).fetch();
		if (openOptional && openOptional.length) {
			availableIds.push({_id: {$in: _.pluck(openOptional, 'mission')}});
		}

		// console.log('Query:', availableIds);

		return Missions.find({
			$or: availableIds
		});
	});

	Meteor.publish('missions.admin.all', function() {
		let userId = this.userId;
		let user = Meteor.users.findOne({_id: userId});
		if (!isAdmin(user)) {
			this.ready();
			return false;
		}
		return Missions.find();
	});
}

export function createTestMissions() {
	console.log('Attempting to create test missions');

	let mission1 = new Mission({
		title: 'And so it begins!',
		description: 'We all have to start somewhere!',
		order: 1,
		optional: false,
		type: 'location',
		lat: 52.206140,
		lng: 6.879748,
	});

	let mission2 = new Mission({
		title: 'Get to work!',
		description: 'Yall should get some work done bitches',
		order: 2,
		optional: false,
		type: 'location',
		lat: 52.219923,
		lng: 6.891697,
	});

	let mission3 = new Mission({
		title: 'Selfie time!',
		description: 'Take a beaaautiful pictare',
		order: 3,
		optional: false,
		type: 'photo',
	});

	let mission4 = new Mission({
		title: 'Selfie time!',
		description: 'Was the picture beautiful?',
		order: 4,
		optional: false,
		type: 'puzzle',
		answer: 'hell yes',
	});

	mission1.save();
	mission2.save();
	mission3.save();
	mission4.save();
	console.log('Missions inserted');
}
