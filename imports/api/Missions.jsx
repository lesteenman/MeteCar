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
		lat: {
			type: Number,
			optional: true
		},
		long: {
			type: Number,
			optional: true
		},
		answer: {
			type: String,
			optional: true
		},
	}
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
	let mission1 = new Mission({
		title: 'And so it begins!',
		description: 'We all have to start somewhere!',
		type: 'location',
		lat: 52.206140,
		long: 6.879748,
	});

	let mission2 = new Mission({
		title: 'Get to work!',
		description: 'Yall should get some work done bitches',
		type: 'location',
		lat: 52.219923,
		long: 6.891697,
	});

	let mission3 = new Mission({
		title: 'Selfie time!',
		description: 'Take a beaaautiful pictare',
		type: 'photo',
	});

	let mission4 = new Mission({
		title: 'Selfie time!',
		description: 'Was the picture beautiful?',
		type: 'puzzle',
		answer: 'hell yes',
	});

	mission1.save();
	mission2.save();
	mission3.save();
	mission4.save();
	console.log('Missions inserted');
}
