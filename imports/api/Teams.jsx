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
			default: false,
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
		},
		update(name, description, avatar) {
			let user = User.current();
			if (user._id != this.captain && !user.isAdmin()) {
				console.log('someone other than the team captain or an admin is trying to update the team');
				return 'Only the captain can make changes';
			}

			console.log('Updating team to:', name, description, avatar);
			this.name = name;
			this.description = description;
			this.avatar = avatar;
			return true;
		},
		pick() {
			// TODO: Let a captain confirm first (add to an array in the teams object?)
			let user = User.current();
			user.team = team;
			user.save();
		},
		confirmMember(userId) {
			let user = User.current();

		},
		removeMember(userId) {
			let user = User.current();

		},
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
		},

		/**
		 * Returns an array of mission ids for missions that are currently
		 * available for this team
		 */
		getMissions() {
			let missionIds;

			// Any mission with a submission
			let teamSubmissions = Submissions.find({
				team: this._id,
			}).fetch();
			missionIds = _.pluck(teamSubmissions, 'mission');

			// Current main mission
			let nextOpen = this.currentMainMission();
			if (nextOpen) missionIds.push(nextOpen._id);

			// Open optional missions
			let openOptional = Missions.find({
				optional: true,
				open: true,
			}).fetch();
			if (openOptional && openOptional.length) {
				missionIds.concat(_.pluck(openOptional, 'mission'));
			}

			return _.uniq(missionIds);
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
