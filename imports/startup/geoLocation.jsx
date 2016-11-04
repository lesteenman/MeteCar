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
	navigator.geolocation.watchPosition(function(loc) {
		let id = deviceIdentifier(),
			lat = loc.coords.latitude,
			long = loc.coords.longitude,
			acc = loc.coords.accuracy,
			time = loc.timestamp

		Meteor.method('location.update', id, lat, long, acc, time, function(err) {
			console.log('Server err:', err);
		});
	}, function(error) {
		// TODO: Handle
		console.log('Location Error:', error);
	}, {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 30000
	});
}
