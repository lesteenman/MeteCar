import { Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

import { Missions } from './Missions.jsx';
import { Submissions } from './Submissions.jsx';

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

		let teamId = Teams.insert({
			name: name,
			description: description,
			captain: this.userId()
		});

		Meteor.users.update(this.userId(), {$set: {team: teamId}});

		let firstMission = Missions.find({order: 1});
		let firstSubmission = new Submission({
			mission: firstMission._id,
			team: teamId,
		});
		firstSubmission.save();
	},
	'teams.pick'(team) {
		// TODO: Let a captain confirm first (add to an array in the teams object?)
		let user = Meteor.user();

		Meteor.users.update(this.userId(), {$set: {team: team}});
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
