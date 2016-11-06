import { Meteor } from 'meteor/meteor';
import { Teams } from './Teams.jsx';

import { distance } from '../helpers/location.js';

Locations = new Mongo.Collection('locations');

// TODO use astronomy with an index on time

Meteor.methods({
	'location.update'(sessionId, lat, long, acc, time) {
		let user = Meteor.user();
		if (!user || !user.team) throw new Meteor.Error(403);

		if (!user.sessions || user.sessions.indexOf(sessionId) < 0) {
			let sessions = user.sessions;
			if (!sessions) sessions = [];
			sessions.push(sessionId);
			Meteor.users.update({_id: this.userId()}, {$set: {"sessions": sessions}});
		}

		let last = Locations.findOne({sessionId}, {sort: {time: -1, limit: 1}, fields: {lat: true, long: true}});
		if (last) {
			let dist = distance(lat, long, last.lat, last.long);
			if (dist < 0.005) {
				console.log('Location update too small', dist);
				return;
			}
		}

		Locations.insert({
			sessionId, lat, long, acc, time
		});
		if (Math.random() > 0.9) fakerCheck(id);

		team = Teams.findOne({name: user.team});
		// checkObjective(team, lat, long, acc);
	}
});

function fakerCheck(clientId) {
	console.log('Faker check unimplemented');
}

function checkObjective(teamId, lat, long, acc) {
	console.log('Objective check unimplemented');
}

if (Meteor.isServer) {
	// location.self
	// location.admin.all
	// location.admin.history: id

	// for team/private, only publish the last or most recent 10 locations?

	Meteor.publish('location.team', function(){
		let team = Meteor.users.find({_id: this.userid}, {team: true}).team;
		if (!team) return {};

		let sessions = [];
		let users = Meteor.users.find({team: team});
		for (let i = 0; i < users.length; i++) {
			sessions = sessions.concat(users[i].sessions || []);
		}

		return Locations.find({sessions: { $in: sessions}}, {sort: {time: -1}});
	});
}
