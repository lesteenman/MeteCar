import { Match } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

import { Missions } from './Missions.jsx';
import { User } from './Accounts.jsx';
import { Submission, Submissions, SubmissionState } from './Submissions.jsx';

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
		approveMember(member) {

		},
		kickMember(member) {

		},
		setHidden(hidden) {
			if (!User.current().isAdmin()) return false;
			this.hidden = hidden;
			this.save();
		}
	},
	helpers: {
		currentMainMission() {
			let approved = Submissions.find({
				team: this._id,
				state: SubmissionState.APPROVED,
			}).fetch();

			// Get which of these is the last in order
			let lastFinished = Missions.findOne({
				optional: false,
				_id: {$in: _.pluck(approved, 'mission')}
			}, {
				sort: {order: -1},
				limit: 1,
			});
			let lastFinishedOrder = lastFinished ? lastFinished.order : 0;

			// Get the first open mission with an order greater than the last (or 0)
			let nextOpen = Missions.findOne({
				order: {$gt: lastFinishedOrder}
			}, {
				sort: {order: 1},
				limit: 1
			});

			return nextOpen;
		}
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
		let user = User.current();
		if (!user) throw new Meteor.Error('not-allowed', 'No user');
		if (user.team) throw new Meteor.Error('not-allowed', 'User already has a team');

		let existing = Teams.find({name: name}).count();
		if (existing) throw new Meteor.Error('name', 'Already in use');

		let team = new Team({
			name: name,
			description: description,
			captain: user.id,
		});
		team.save();

		user.team = team._id;
		user.save();
	},
	'teams.update'(name, description, photo) {
		
	},
	'teams.pick'(team) {
		// TODO: Let a captain confirm first (add to an array in the teams object?)
		let user = User.current();
		user.team = team;
		user.save();
	},
	'teams.member.confirm'(userId) {

	},
	'teams.member.remove'(userId) {

	},
});

if (Meteor.isServer) {
	Meteor.publish('teams.all', function() {
		let user = User.current(this);

		let filter;
		let fields = {
			_id: true,
			name: true,
			description: true,
			captain: true,
			avatar: true,
		};

		if (!user) {
			filter = {
				hidden: false,
			};
		} else {
			if (user.isAdmin()) {
				filter = {};
			} else {
				filter = {$or: [
					{hidden: false},
					{_id: user.team},
				]};
			}
		}

		// console.log('Filter, fields:', filter, fields);

		return Teams.find(filter, {
			fields: fields
		});
	});

	Teams.allow({
		update: function(userId, doc, fieldNames, modifier) {},
	});
}
