import { Tracker } from 'meteor/tracker'

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

if (Meteor.isClient) {
	Tracker.autorun(() => {
		if (Meteor.loggingIn() || !Meteor.user()) return;
		navigator.geolocation.watchPosition(function(loc) {
			let id = deviceIdentifier(),
				lat = loc.coords.latitude,
				long = loc.coords.longitude,
				acc = loc.coords.accuracy,
				time = loc.timestamp;

			Meteor.call('location.update', id, lat, long, acc, time, function(err) {
				if (err) {
					console.log('Server err:', err);
				}
			});
		}, function(error) {
			// TODO: Handle
			console.log('Location Error:', error);
		}, {
			enableHighAccuracy: true,
			timeout: 10000,
			maximumAge: 30000
		});
	});
}
