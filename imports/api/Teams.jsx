import { Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { Missions } from './Missions.jsx';
import { Submission, Submissions } from './Submissions.jsx';

export const Teams = new Mongo.Collection('teams');

export const Team = Class.create({
	name: 'Team',
	collection: Teams,
	secured: false,
	fields: {
		name: {
			type: String,
			validators: [{
				type: 'minLength',
				param: 3
			},{
				type: 'string'
			}],
		},
		description: {
			type: String,
			validators: [{
				type: 'minLength',
				param: 1
			}],
		},
		avatar: {
			type: String,
			optional: true,
		},
		hidden: {
			type: Boolean,
			optional: true,
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
			if (Meteor.userId() != doc.captain) {
				console.log('someone other than the team captain is trying to update the team');
				return false;
			}

			let allowed = ['name', 'description', 'avatar'];
			let modified = doc.getModified();
			for (let f = 0; f < modified.length; f++) {
				let field = modified[f];
					if (allowed.indexOf(field) < 0) {
						console.log('Field not allowed', field, allowed.indexOf(field));
						return false;
					}
			}

			console.log('Updating:', modified);
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
		let user = Meteor.users.findOne({_id: this.userId});
		let filter = (user && user.profile.admin) ? {} : {
			hidden: false,
		};
		let fields = {
			_id: true,
			name: true,
			description: true,
			captain: true,
			avatar: true,
		};

		if (user && user.profile.admin) {
			fields.hidden = true;
		}

		return Teams.find(filter, {
			fields: fields
		});
	});

	Teams.allow({
		update: function(userId, doc, fieldNames, modifier) {},
	});
}
