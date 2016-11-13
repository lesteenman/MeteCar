import React, { Component } from 'react';
import Helmet from 'react-helmet'

import { createContainer } from 'meteor/react-meteor-data';

import Map, { Marker } from '../ui/google-map';
import mapStyle from '../ui/google-map/style.json';

import { Missions } from '../../api/Missions.jsx';
import Locations from '../../api/Locations.jsx';
import { distance, containingViewport, calculateZoomLevel } from '../../helpers/location.js';

class MapPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);

		let currentLocations = _.chain(this.props.locations)
			.groupBy('session')
			.map(function(locations) {
				return _.max(locations, (location) => location.time)
			})
			.value();

		console.log('Current Locations', currentLocations);

		let vp = containingViewport(currentLocations.concat(this.props.missions));

		let lat = vp.lat2 - (vp.lat2 - vp.lat1) / 2;
		let lng = vp.lng2 - (vp.lng2 - vp.lng1) / 2;

		// TODO: Calculate so all points are in view
		let initialCenter = {
			lat: lat,
			lng: lng,
		};

		// Make an educated guess about the zoom level required to fit all points

		console.log('Viewport between', vp);

		let vpw = distance(vp.lat1, vp.lng1, vp.lat2, vp.lng1);
		let vph = distance(vp.lat1, vp.lng1, vp.lat1, vp.lng2);

		let horizontalZoom = calculateZoomLevel(400, vpw);
		let verticalZoom = calculateZoomLevel(500, vph);

		let initialZoom = Math.min(15, Math.max(horizontalZoom, verticalZoom));

		console.log('Using zoom:', initialZoom);
		console.log('Would want to use zoom', horizontalZoom, verticalZoom);

		let markers = [];
		for (let i = 0; i < currentLocations.length; i++) {
			let currentLocation = currentLocations[i];
			console.log('Create Marker:', currentLocation, {lat: currentLocation.lat, lng: currentLocation.lng});
			markers.push(
				<Marker
					key={currentLocation.time}
					name={currentLocation.session}
					position={{lat: currentLocation.lat, lng: currentLocation.lng}}
				/>
			);
			
		}
		for (let i = 0; i < this.props.missions.length; i++) {
			let mission = this.props.missions[i];
			console.log('Create Marker:', mission, {lat: mission.lat, lng: mission.lng});
			markers.push(
				<Marker
					key={mission._id}
					name={mission.session}
					position={{lat: mission.lat, lng: mission.lng}}
				/>
			);
			
		}

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
	return {
		ready: locationsHandle.ready() && missionsHandle.ready(),
		locations: Locations.find().fetch(),
		missions: Missions.find({type: 'location'}).fetch(),
	};
}, MapPage);
