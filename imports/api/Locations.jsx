import { Class } from 'meteor/jagi:astronomy';
import { Meteor } from 'meteor/meteor';
import { Team } from './Teams.jsx';
import { User } from './Accounts.jsx';
import { Mission, MissionType } from './Missions.jsx';

import { distance } from '../helpers/location.js';

export default Locations = new Mongo.Collection('locations');

export const Location = Class.create({
	name: 'Location',
	collection: Locations,
	fields: {
		_id: String,
		session: String,
		lat: Number,
		lng: Number,
		acc: Number,
		time: {
			type: Number,
			index: -1,
		},
	},
});

Location.last = function(session) {
	return Location.findOne({session: session}, {sort: {time: -1, limit: 1}});
};

// To work reactively, this needs subscriptions on locations (obviously).
// It also needs users and teams, but those should all have already been
// subscribed to by our root pages.
Location.currentLocations = function() {
	let users = User.find();

	let sessionIds = [];
	users.forEach((user) => {
		if (user.sessions) sessionIds = sessionIds.concat(user.sessions);
	});

	let locations = [];
	sessionIds.forEach((sessionId) => {
		let sessionLocation = Location.last(sessionId);
		// TODO: Check if it still somewhat recent
		if (sessionLocation) locations.push(sessionLocation);
	});

	return locations;
}

Meteor.methods({
	'location.update'(session, lat, lng, acc, time) {
		let user = User.current();
		if (!user || !user.team) throw new Meteor.Error(403);

		if (!user.sessions || user.sessions.indexOf(session) < 0) {
			let sessions = user.sessions;
			if (!sessions) sessions = [];
			sessions.push(session);
			user.sessions = sessions;
			user.save();
		}

		let last = Location.last(session);
		if (last) {
			let dist = distance(lat, lng, last.lat, last.lng);
			if (dist < 0.005) {
				return;
			}
		}

		let location = new Location();
		location.session = session;
		location.lat = lat;
		location.lng = lng;
		location.acc = acc;
		location.time = time;
		location.save();

		// if (Math.random() > 0.9) fakerCheck(session);

		// team = Team.findOne({name: user.team});
		// let missionIds = team.getMissions();
		// let missions = Mission.find({
		// 	id: {$in: missionIds},
		// 	type: MissionType.LOCATION,
		// }).fetch();
		// missions.forEach((mission) => {
		// 	// check if is open
		// 	// check if location is near enough
		// 	// ...
		// 	// profit! :D
		// });
	}
});

function fakerCheck(session) {
	console.log('Faker check unimplemented');
}

function checkObjective(teamId, lat, lng, acc) {
	console.log('Objective check unimplemented');
}

if (Meteor.isServer) {
	// location.self
	// location.admin.all
	// location.admin.history: id

	// for team/private, only publish the last or most recent 10 locations?

	Meteor.publish('locations.admin.all', function() {
		let user = User.current(this);
		if (!(user && user.isAdmin())) {
			this.ready();
			return;
		}
		return Locations.find();
	});

	Meteor.publish('locations.team', function() {
		let user = User.current(this);
		if (!(user && user.team)) {
			console.log('unteamed user found');
			this.ready();
			return;
		}

		let sessions = [];
		let users = User.find({team: user.team}).fetch();
		for (let i = 0; i < users.length; i++) {
			sessions = sessions.concat(users[i].sessions || []);
		}

		return Locations.find({session: { $in: sessions}}, {sort: {time: -1}});
	});
}
