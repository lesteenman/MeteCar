var isEmailValid = function(address) {
	return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(address);
};

Meteor.methods({
	'accounts.signup'(email, password1, password2) {
		// TODO: Test and re-enable later
		if (!isEmailValid(email)) throw new Meteor.Error('email', 'Not a valid email');
		if (password1.length < 8) throw new Meteor.Error('password1', 'Password too short');
		if (password1 !== password2) throw new Meteor.Error('password2', 'Password not equal');
		let password = password1;

		console.log('Creating User:', email, password); // TODO: Clearly remove this

		let user = Accounts.createUser({
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
	// users.admin.all
	// just users.all?

	Meteor.publish('users.all', function() {
		const options = {
			fields: {
				email: true,
				team: true
			}
		};

		return Meteor.users.find({}, options);
	});
}
