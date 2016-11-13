import { Class, Enum } from 'meteor/jagi:astronomy';

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
});

if (Meteor.isServer) {
	// missions.admin.all
	// missions.team
	Meteor.publish('missions.team', function() {
		let user = this.userId;
		let team = Meteor.users.find({_id: user}).team;

		// TODO: Base on available submissions
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
