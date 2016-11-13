export function distance(lat1, long1, lat2, long2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(long2-long1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2)
	; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
}

export function containingViewport(locations) {
	let latMin, latMax, lngMin, lngMax;

	console.log('Locations:', locations);

	locations.forEach(function(l) {
		if (latMin === undefined || l.lat < latMin) latMin = l.lat;
		if (latMax === undefined || l.lat > latMax) latMax = l.lat;
		if (lngMin === undefined || l.lng < lngMin) lngMin = l.lng;
		if (lngMax === undefined || l.lng > lngMax) lngMax = l.lng;
	});

	let vp = {
		lat1: latMin,
		lat2: latMax,
		lng1: lngMin,
		lng2: lngMax,
	}
	console.log('Viewport: ', vp);
	return vp;
}

// Calculates zoomlevel required to fit a certain range on a certain screen width
export function calculateZoomLevel(screenWidth, range) {
	let equatorLength = 40075004; // in meters
	let widthInPixels = screenWidth;
	let metersPerPixel = equatorLength / 256;
	let zoomLevel = 1;
	while ((metersPerPixel * widthInPixels) > range) {
		metersPerPixel /= 2;
		zoomLevel++;
	}
	console.log("zoom level = ", zoomLevel);
	return zoomLevel;
}

