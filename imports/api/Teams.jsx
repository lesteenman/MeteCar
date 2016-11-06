import { Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

export const Teams = new Mongo.Collection('teams');

Meteor.methods({
	'teams.create'(name, description, photo) {
		let user = Meteor.user();
		if (!user) throw new Meteor.Error('not-allowed', 'No user');
		if (user.team) throw new Meteor.Error('not-allowed', 'User already has a team');

		if (!Match.test(name, String)) throw new Meteor.Error('name', 'Not a valid teamname');
		if (name.length < 2) throw new Meteor.Error('name', 'Too short');

		let existing = Teams.find({name: name}).count();
		if (existing) throw new Meteor.Error('name', 'Already in use');

		let id = Teams.insert({
			name: name,
			description: description,
			captain: Meteor.userId()
		});

		Meteor.users.update(Meteor.userId(), {$set: {team: id}});
	},
	'teams.pick'(team) {
		// TODO: Let a captain confirm first (add to an array in the teams object?)
		let user = Meteor.user();

		Meteor.users.update(Meteor.userId(), {$set: {team: team}});
	},
	'teams.confirm'() {

	}
});

if (Meteor.isServer) {
	Meteor.publish('teams.all', function() {
		return Teams.find({}, {
			fields: {
				_id: true,
				name: true,
				description: true
			}	
		});
	});
}
