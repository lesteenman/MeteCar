import { validEmail } from 'meteor/froatsnook:valid-email';

Meteor.methods({
	'accounts.signup'({email, password1, password2}) {
		console.log('email', email);
		// TODO: Test and re-enable later
		// if (!Match.test(email, validEmail)) throw new Meteor.Error('email', 'Not a valid email');
		if (password1.length < 8) throw new Meteor.Error('password1', 'Password too short');
		if (password1 !== password2) throw new Meteor.Error('password2', 'Password not equal');
		let password = password1;

		console.log('Creating User:', email, password); // TODO: Clearly remove this

		Accounts.createUser({
			email: email,
			password: password,
			profile: {
				team: false
			}
		});
	},
});
