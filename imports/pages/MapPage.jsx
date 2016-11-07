import React, { Component } from 'react';
import Helmet from 'react-helmet'

import { createContainer } from 'meteor/react-meteor-data';

import Map, { Marker } from '../ui/google-map';
import mapStyle from '../ui/google-map/style.json';

import Locations from '../api/Locations.jsx';

class MapPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);
		let myLocation = {
			lat: 0,
			long: 0
		};

		let markers = [];
		for (let i = 0; i < this.props.currentLocations.length; i++) {
			let currentLocation = this.props.currentLocations[i];
			markers.push(
				<Marker
					name={currentLocation.sessionId}
					position={{lat: currentLocation.lat, long: currentLocation.long}}
				/>
			);
			
		}

		if (!this.props.ready) return (<div></div>);

		return (
			<div>
				<Helmet title='Map' />
				<Map google={window.google}
					zoom={14}
					center={myLocation}
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
		currentLocations: Locations.find({}, {limit: 2})
	};
}, MapPage);
