import { Meteor } from 'meteor/meteor';
import { Teams } from './Teams.jsx';
import { User } from './Accounts.jsx';

import { distance } from '../helpers/location.js';

export default Locations = new Mongo.Collection('locations');

// TODO use astronomy with an index on time

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

		let last = Locations.findOne({session}, {sort: {time: -1, limit: 1}, fields: {lat: true, lng: true}});
		if (last) {
			let dist = distance(lat, lng, last.lat, last.lng);
			if (dist < 0.005) {
				return;
			}
		}

		Locations.insert({
			session, lat, lng, acc, time
		});
		if (Math.random() > 0.9) fakerCheck(session);

		team = Teams.findOne({name: user.team});
		// checkObjective(team, lat, lng, acc);
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
		let user = User.findOne({_id: this.userId}, {team: true});
		let team = user.team;
		if (!team) {
			this.ready();
			return;
		}

		let sessions = [];
		let users = User.find({team: team}).fetch();
		for (let i = 0; i < users.length; i++) {
			sessions = sessions.concat(users[i].sessions || []);
		}

		return Locations.find({session: { $in: sessions}}, {sort: {time: -1}});
	});
}
