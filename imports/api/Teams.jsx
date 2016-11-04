import { Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

Meteor.methods({
	'teams.create'(name, description, photo) {
		let user = Meteor.user();
		if (!user) throw new Meteor.Error('not-allowed', 'No user');
		if (user.team) throw new Meteor.Error('not-allowed', 'User already has a team');

		if (!Match.test(name, String)) throw new Meteor.Error('name', 'Not a valid teamname');
		if (name.length < 2) throw new Meteor.Error('name', 'Too short');

		let existing = Team.find({name: name}).count();
		console.log('Existing:', existing);
		if (existing) throw new Meteor.Error('name', 'Already in use');

		Team.insert({
			name: name,
			description: description,
			captain: Meteor.userId()
		});

		let profile = Meteor.user().profile;
		profile.team = name;

		Meteor.users.update(Meteor.userId(), {$set: {profile: profile}});
	},
	'teams.pick'({team}) {
		// TODO: Let a captain confirm first (add to an array in the teams object?)
		let user = Meteor.user();
		user.profile.team = team;
		Meteor.users.update(Meteor.userId(), {$set: {profile: user.profile}});
	},
	'teams.confirm'() {

	}
});

export const Team = new Mongo.Collection('teams');

