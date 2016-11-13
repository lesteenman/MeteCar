import React, { Component } from 'react';
import Helmet from 'react-helmet'

import { createContainer } from 'meteor/react-meteor-data';

import Map, { Marker } from '../ui/google-map';
import mapStyle from '../ui/google-map/style.json';

import Locations from '../../api/Locations.jsx';
import { distance, containingViewport, calculateZoomLevel } from '../../helpers/location.js';

class MapPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);

		let vp = containingViewport(this.props.currentLocations);

		let lat = vp.lat2 - (vp.lat2 - vp.lat1) / 2;
		let lng = vp.lng2 - (vp.lng2 - vp.lng1) / 2;

		// TODO: Calculate so all points are in view
		let initialCenter = {
			lat: lat,
			lng: lng,
		};

		// Make an educated guess about the zoom level required to fit all points

		let vpw = distance(vp.lat1, vp.lng1, vp.lat1, vp.lng2);
		let vph = distance(vp.lat1, vp.lng1, vp.lat2, vp.lng1);

		let horizontalZoom = calculateZoomLevel(400, vpw);
		let verticalZoom = calculateZoomLevel(500, vph);

		let initialZoom = Math.min(17, Math.max(horizontalZoom, verticalZoom));

		console.log('Using zoom:', initialZoom);
		console.log('Would want to use zoom', horizontalZoom, verticalZoom);

		let markers = [];
		for (let i = 0; i < this.props.currentLocations.length; i++) {
			let currentLocation = this.props.currentLocations[i];
			console.log('Create Marker:', currentLocation, {lat: currentLocation.lat, lng: currentLocation.lng});
			markers.push(
				<Marker
					key={currentLocation.time}
					name={currentLocation.sessionId}
					position={{lat: currentLocation.lat, lng: currentLocation.lng}}
				/>
			);
			
		}
		console.log('Markers:', markers);

		if (!this.props.ready) return (<div></div>);

		return (
			<div>
				<Helmet title='Map' />
				<Map google={window.google}
					zoom={initialZoom}
					initialCenter={initialCenter}
					styles={mapStyle}>
					{markers}
				</Map>
			</div>
		);
	}
}

export default createContainer(() => {
	let locationsHandle = Meteor.subscribe('locations.team');
	let missionsHandle = Meteor.subscribe('missions.team');
	console.log('CreateContainer', Locations.find({}, {limit: 2}).fetch(), locationsHandle.ready());
	return {
		ready: locationsHandle.ready(),
		currentLocations: Locations.find().fetch()
	};
}, MapPage);
