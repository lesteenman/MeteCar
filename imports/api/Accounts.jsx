import { Meteor } from 'meteor/meteor';

import { Match } from 'meteor/check';
import { IsValidEmail } from 'meteor/froatsnook:valid-email';

Meteor.methods({
	'accounts.signup'({email, teamname, description, password1, password2}) {
		console.log('email', email, 'teamname', teamname, 'description', description, 'p1', password1, 'p2', password2);
		if (!IsValidEmail(email)) throw new Meteor.Error('email', 'Not a valid email');
		if (!Match.test(teamname, String)) throw new Meteor.Error('teamname', 'Not a valid teamname');
		if (teamname.length < 2) throw new Meteor.Error('teamname', 'Teamname too short');
		if (password1.length < 8) throw new Meteor.Error('password1', 'Password too short');
		if (password1 !== password2) throw new Meteor.Error('password2', 'Password not equal');
		let password = password1;

		Accounts.createUser({
			email: email,
			username: teamname,
			password: password,
			profile: {
				description: description
			}
		});
	},
});
