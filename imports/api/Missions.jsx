import { Class, Enum } from 'meteor/jagi:astronomy';
import { isAdmin } from '../helpers/user.js';
import { Submissions } from './Submissions.jsx';
import { Team } from './Teams.jsx';
import { User } from './Accounts.jsx';

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
			if (!User.current().isAdmin()) return false;

			this.open = open;
			return this.save();
		},
	},
});

if (Meteor.isServer) {
	Meteor.publish('missions.team', function() {
		let userId = this.userId;
		let user = User.findOne({_id: userId});
		let teamId = user.team;
		let team = Team.findOne({_id: teamId});
		if (!teamId) {
			this.ready();
			return false;
		}

		let availableIds = Team.getMissions();

		return Missions.find({
			_id: {$in: availableIds},
		});
	});

	Meteor.publish('missions.admin.all', function() {
		let userId = this.userId;
		let user = User.findOne({_id: userId});
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
