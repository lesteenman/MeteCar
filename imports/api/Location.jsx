import { Meteor } from 'meteor/meteor';

Meteor.methods({
	'location.update'({id, lat, long, acc, time}) {
		console.log('Location set for session', id, lat, long, acc, time, Meteor.default_connection._lastSessionId);
	}
});
