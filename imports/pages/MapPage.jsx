import React, { Component } from 'react';
import Helmet from 'react-helmet'

import { createContainer } from 'meteor/react-meteor-data';

import Map, { GoogleApiWrapper } from '../ui/google-map';
import mapStyle from '../ui/google-map/style.json';

class MapPage extends Component {
	render() {
		let myLocation = {
			lat: 0,
			long: 0
		};

		if (!this.props.ready) return (<div></div>);

		return (
			<div>
				<Helmet title='Map' />
				<Map google={window.google}
					zoom={14}
					center={myLocation}
					styles={mapStyle}>
				</Map>
			</div>
		);
	}
}

export default createContainer(() => {
	let locationsHandler = Meteor.subscribe('location.team');
	let missionsHandler = Meteor.subscribe('missions.team');
	return {
		ready: locationsHandler.ready()
	};
}, MapPage);
