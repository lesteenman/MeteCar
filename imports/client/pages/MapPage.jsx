import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Map, { Marker, InfoWindow } from '../ui/google-map';
import mapStyle from '../ui/google-map/style.json';
import TitledPage from '../ui/TitledPage.jsx';
import MissionMap from '../ui/MissionMap.jsx';

import { User } from '/imports/api/Accounts.jsx';
import { Mission, MissionType } from '/imports/api/Missions.jsx';
import Locations from '/imports/api/Locations.jsx';
import { distance, containingViewport, calculateZoomLevel } from '../../helpers/location.js';

class MapPage extends TitledPage {
	isReady() { return this.props.ready; }
	getTitle() { return "Map"; }

	pageRender() {
		let currentLocations = _.chain(this.props.locations)
			.groupBy('session')
			.map(function(locations) {
				return _.max(locations, (location) => location.time)
			})
			.value();

		return (
			<MissionMap
				users={currentLocations}
				missions={this.props.missions}
				center={this.props.center}
			/>
		);
	}
}

export default createContainer((props) => {
	let ready, locations, missions;

	if (User.current().isAdmin()) {
		let locationsHandle = Meteor.subscribe('locations.admin.all');
		let missionsHandle = Meteor.subscribe('missions.admin.all');
		ready = locationsHandle.ready() && missionsHandle.ready();
		locations = {}; // Locations.find().fetch(); // Only last locations
		missions = Mission.find({type: 'location'}).fetch();
	}
	else {
		let locationsHandle = Meteor.subscribe('locations.team');
		let missionsHandle = Meteor.subscribe('missions.team');
		ready = locationsHandle.ready() && missionsHandle.ready();
		locations = Locations.find().fetch(); // Only last and relevant locations
		missions = Mission.find({type: 'location'}).fetch();
	}

	let center;
	let centerType = props.routeParams.centerType;
	let centerId = props.routeParams.centerId;
	if (centerType == 'mission') {
		let mission = Mission.findOne(centerId);
		if (mission && mission.type == MissionType.LOCATION) {
			center = {
				lat: mission.lat,
				lng: mission.lng,
			};
		}
	} else if (centerType == 'user') {
		// TODO: Get the user's current location
	}

	return {
		ready: ready,
		locations: locations,
		missions: missions,
		center: center,
	};
}, MapPage);
