import { Meteor } from 'meteor/meteor';

LocationLog = new Mongo.Collection('LocationLog');

Meteor.methods({
	'location.update'(id, lat, long, acc, time) {
		console.log('Location set for session', id, lat, long, acc, time);

		LocationLog.insert({
			id, lat, long, acc, time
		});
		if (Math.random() > 0.9) fakerCheck(id);

		// team = Team.findOne({clientId: id});
		// if (!team) {
		// 	user = Meteor.user();
		// 	team = user.team;
		// }
		// checkObjective(team, lat, long, acc);
	}
});

function fakerCheck(clientId) {
	console.log('No, no faker check yet, no...');
}

function checkObjective(teamId, lat, long, acc) {
	console.log('No objective for you');
}
