import { Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { Missions } from './Missions.jsx';
import { Submission, Submissions } from './Submissions.jsx';

export const Teams = new Mongo.Collection('teams');

export const Team = Class.create({
	name: 'Team',
	collection: Teams,
	fields: {
		name: {
			type: String,
			validators: [{
				type: 'minLength',
				param: 3
			},{
				type: 'string'
			}],
			secured: false,
		},
		description: {
			type: String,
			validators: [{
				type: 'minLength',
				param: 1
			}],
			secured: false,
		},
		captain: String,
	},
	meteorMethods: {
		pickMember(member) {

		},
		kickMember(member) {

		},
	},
	events: {
		beforeUpdate(e) {
			let doc = e.currentTarget;
			if (Meteor.userId() != doc.captain) return false;

			let allowed = ['name', 'description'];
			let modified = doc.getModified();
			for (let f = 0; f < modified.length; f++) {
				let field = modified[f];
					if (allowed.indexOf(field) < 0) {
						console.log('Field not allowed', field, allowed.indexOf(field));
						return false;
					}
			}

			return true;
		},
	},
});

Meteor.methods({
	'teams.create'(name, description, photo) {
		let user = Meteor.user();
		if (!user) throw new Meteor.Error('not-allowed', 'No user');
		if (user.team) throw new Meteor.Error('not-allowed', 'User already has a team');

		let existing = Teams.find({name: name}).count();
		if (existing) throw new Meteor.Error('name', 'Already in use');

		let team = new Team({
			name: name,
			description: description,
			captain: Meteor.userId()
		});
		team.save();

		Meteor.users.update(Meteor.userId(), {$set: {team: team._id}});

		if (Meteor.isServer) {
			let firstMission = Missions.findOne({order: 1});
			let firstSubmission = new Submission({
				mission: firstMission._id,
				team: team._id,
			});
			firstSubmission.save(function(error, id) {
				if (error ) {
					console.error(error);
					// Roll back
					team.remove();
					Meteor.users.update(Meteor.userId(), {$set: {team: null}});
				}
			});
		}
	},
	'teams.update'(name, description, photo) {
		
	},
	'teams.pick'(team) {
		// TODO: Let a captain confirm first (add to an array in the teams object?)
		let user = Meteor.user();

		Meteor.users.update(Meteor.userId(), {$set: {team: team}});
	},
	'teams.member.confirm'(userId) {

	},
	'teams.member.remove'(userId) {

	},
});

if (Meteor.isServer) {
	Meteor.publish('teams.all', function() {
		return Teams.find({}, {
			fields: {
				_id: true,
				name: true,
				description: true,
				captain: true,
			}	
		});
	});

	Teams.allow({
		update: function(userId, doc, fieldNames, modifier) {},
	});
}
