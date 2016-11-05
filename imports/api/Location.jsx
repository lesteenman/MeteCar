import { Meteor } from 'meteor/meteor';
import { Team } from './Teams.jsx';

LocationLog = new Mongo.Collection('LocationLog');

Meteor.methods({
	'location.update'(id, lat, long, acc, time) {
		let user = Meteor.user();
		if (!user || !user.team) throw new Meteor.Error(403);

		if (!user.sessions || user.sessions.indexOf(id) < 0) {
			let sessions = user.sessions;
			if (!sessions) sessions = [];
			sessions.push(id);
			Meteor.users.update({_id: Meteor.userId()}, {$set: {"sessions": sessions}});
		}

		console.log('Location set for session', id, lat, long, acc, time);

		LocationLog.insert({
			id, lat, long, acc, time
		});
		if (Math.random() > 0.9) fakerCheck(id);

		team = Team.findOne({name: user.team});
		// checkObjective(team, lat, long, acc);
	}
});

function fakerCheck(clientId) {
	console.log('No, no faker check yet, no...');
}

function checkObjective(teamId, lat, long, acc) {
	console.log('No objective for you');
}
