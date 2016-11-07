import React, { Component } from 'react';
import Helmet from 'react-helmet'

import { createContainer } from 'meteor/react-meteor-data';

import Map, { Marker } from '../ui/google-map';
import mapStyle from '../ui/google-map/style.json';

import Locations from '../../api/Locations.jsx';

class MapPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);
		// TODO: Calculate so all points are in view
		let initialCenter = {
			lat: 52.220637,
			lng: 6.897822
		};
		let initialZoom = 14;

		let markers = [];
		// console.log('Locations:', this.props.currentLocations);
		// for (let i = 0; i < this.props.currentLocations.length; i++) {
		// 	let currentLocation = this.props.currentLocations[i];
		// 	console.log('Create Marker:', currentLocation);
		// 	continue;
		// 	markers.push(
		// 		<Marker
		// 			key={currentLocation.time}
		// 			name={currentLocation.sessionId}
		// 			position={{lat: currentLocation.lat, long: currentLocation.long}}
		// 		/>
		// 	);
			
		// }

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
	let locationsHandler = Meteor.subscribe('location.team');
	let missionsHandler = Meteor.subscribe('missions.team');
	return {
		ready: locationsHandler.ready(),
		currentLocations: Locations.find({}, {limit: 2}).fetch()
	};
}, MapPage);
