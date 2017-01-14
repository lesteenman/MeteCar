import { Class } from 'meteor/jagi:astronomy';

var isEmailValid = function(address) {
	return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(address);
};

// const Address = Class.create({
// 	name: 'Address',
// 	fields: {
// 		address: {
// 			type: String,
// 			validators: [{
// 				type: 'email',
// 			}],
// 		},
// 		verified: Boolean,
// 	},
// });

// const User = Class.create({
// 	name: 'Users',
// 	collection: Meteor.users,
// 	fields: {
// 		username: String,
// 		emails: {
// 			type: [Address],
// 			optional: true,
// 		},
// 		password: String,
// 	}
// });

Meteor.methods({
	'accounts.signup'(username, email, password1, password2) {
		// TODO: Test and re-enable later
		if (!isEmailValid(email)) throw new Meteor.Error('email', 'Not a valid email');
		if (password1.length < 8) throw new Meteor.Error('password1', 'Password too short');
		if (password1 !== password2) throw new Meteor.Error('password2', 'Password not equal');
		let password = password1;

		console.log('Creating User:', email, password); // TODO: Clearly remove this

		let user = Accounts.createUser({
			username: username,
			email: email,
			password: password,
			profile: {
				team: false
			}
		});
		return user;
	},
});

Meteor.users.deny({
	update() { return true; }
});

if (Meteor.isServer) {
	Meteor.publish('users.all', function() {
		const options = {
			fields: {
				username: true,
				email: true,
				team: true,
				sessions: true,
				admin: true,
			}
		};

		return Meteor.users.find({}, options);
	});
}
