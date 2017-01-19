import { Tracker } from 'meteor/tracker'
import { User } from '/imports/api/Accounts.jsx';

function deviceIdentifier(user) {
	let id;
	if (!(id = localStorage.getItem("device-id-"+user.username))) {
		id = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i=0; i < 15; i++)
			id += possible.charAt(Math.floor(Math.random() * possible.length));

		localStorage.setItem("device-id-"+user.username, id);
	}
	return id;
}

var lastTime = false;

if (Meteor.isClient) {
	Tracker.autorun(() => {
		let user = User.current();
		if (Meteor.loggingIn() || !user || !user.team) return;

		navigator.geolocation.watchPosition(function(loc) {
			let id = deviceIdentifier(user),
				lat = loc.coords.latitude,
				lng = loc.coords.longitude,
				acc = loc.coords.accuracy,
				time = loc.timestamp;

			if (time != lastTime) {
				lastTime = time;
				console.log('location', id, lat, lng, acc, time);
				Meteor.call('location.update', id, lat, lng, acc, time, function(err) {
					if (err) {
						console.error('Server err:', err);
					}
				});
			}
		}, function(error) {
			// TODO: Handle
			console.error('Location Error:', error);
		}, {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 30000
		});
	});
}
