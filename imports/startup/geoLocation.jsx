import { Tracker } from 'meteor/tracker'
import { User } from '/imports/api/Accounts.jsx';

function deviceIdentifier() {
	let id;
	if (!(id = localStorage.getItem("device-id"))) {
		id = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i=0; i < 15; i++)
			id += possible.charAt(Math.floor(Math.random() * possible.length));

		localStorage.setItem("device-id", id);
	}
	return id;
}

var lastTime = false;

if (Meteor.isClient) {
	Tracker.autorun(() => {
		if (Meteor.loggingIn() || !User.current() || !User.current().team) return;

		navigator.geolocation.watchPosition(function(loc) {
			let id = deviceIdentifier(),
				lat = loc.coords.latitude,
				lng = loc.coords.longitude,
				acc = loc.coords.accuracy,
				time = loc.timestamp;

			if (time != lastTime) {
				lastTime = time;
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
