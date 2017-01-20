import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Map, { Marker, InfoWindow } from '../ui/google-map';
import mapStyle from '../ui/google-map/style.json';

import TeamAvatars from '/imports/api/TeamAvatars.jsx';
import { User } from '/imports/api/Accounts.jsx';
import { Team } from '/imports/api/Teams.jsx';
import { Mission } from '/imports/api/Missions.jsx';
import { Location } from '/imports/api/Locations.jsx';
import { distance, containingViewport, calculateZoomLevel } from '../../helpers/location.js';

export default class MissionMap extends Component {
	constructor(props, context) {
		super(props, context);

		this.onMarkerClick = this._onMarkerClick.bind(this);
		this.onInfoWindowHidden = this._onInfoWindowHidden.bind(this);

		this.state = {
			infoWindowVisible: false,
		};
	}

	render() {
		let currentLocations = Location.currentLocations();

		let vp = containingViewport(this.props.missions);

		let lat = vp.lat2 - (vp.lat2 - vp.lat1) / 2;
		let lng = vp.lng2 - (vp.lng2 - vp.lng1) / 2;

		// TODO: Calculate so all points are in view
		let initialCenter = this.props.center ? this.props.center : {
			lat: lat,
			lng: lng,
		};

		// Make an educated guess about the zoom level required to fit all points
		let vpw = distance(vp.lat1, vp.lng1, vp.lat2, vp.lng1);
		let vph = distance(vp.lat1, vp.lng1, vp.lat1, vp.lng2);

		let horizontalZoom = calculateZoomLevel(400, vpw);
		let verticalZoom = calculateZoomLevel(500, vph);

		let initialZoom = Math.min(15, Math.max(horizontalZoom, verticalZoom));

		let markers = [];
		currentLocations.forEach((location) => {
			let user = User.findOne({sessions: location.session});
			if (!user) return;
			let avatar;
			if (user.team) {
				let team = Team.findOne(user.team);
				avatar = TeamAvatars.findOne(team.avatar);
			}
			markers.push(
				<Marker
					key={location.time}
					type='user'
					userId={user._id}
					name={location.session}
					timestamp={location.time}
					position={{lat: location.lat, lng: location.lng}}
					onClick={this.onMarkerClick}
					icon={avatar ? avatar.url({store: 'thumbs'}) : undefined}
				/>
			);
		});

		this.props.missions.forEach((mission) => {
			markers.push(
				<Marker
					key={mission._id}
					type='mission'
					missionId={mission._id}
					name={mission.title}
					position={{lat: mission.lat, lng: mission.lng}}
					onClick={this.onMarkerClick}
				/>
			);
		});

		let info = this.getInfoWindow();

		return (
			<Map google={window.google}
				zoom={initialZoom}
				initialCenter={initialCenter}
				styles={mapStyle}
				allowPanning={this.props.allowPanning}
				allowZooming={this.props.allowZooming}
			>
				{markers}
				{info}
			</Map>
		);
	}

	_onInfoWindowHidden(e) {
		console.log('Hidden', e);
		this.setState({
			infoWindowVisible: false,
			user: undefined,
			mission: undefined,
		});
	}

	_onMarkerClick(props, marker) {
		console.log('marker clicked', props);
		state = {
			infoWindowVisible: true,
			selectedMarker: marker,
			user: undefined,
			mission: undefined,
		};
		if (props.type == 'user') {
			state.user = User.findOne(props.userId);
			state.session = props.name;
			state.timestamp = props.timestamp;
		}
		if (props.type == 'mission') state.mission = Mission.findOne(props.missionId);
		this.setState(state);
	}

	getInfoWindow() {
		let info;
		if (this.state.mission) {
			info = (
				<div>
					<h2>Mission: {this.state.mission.title}</h2>
					<a href={'/missions/' + this.state.mission._id}>View mission</a>
				</div>
			);
		} else if (this.state.user) {
			info = (
				<div>
					User: {this.state.user.username}<br />
					Session: {this.state.session}<br />
					Timestamp: {new Date(this.state.timestamp).toDateString()}<br />
				</div>
			);
		} else {
			info = (
				<div>
				</div>
			);
		}

		return (
			<InfoWindow
				marker={this.state.selectedMarker}
				visible={this.state.infoWindowVisible}
				onClose={this.state.onInfoWindowHidden}
				style={{color: '#333'}}
			>
				{info}
			</InfoWindow>
		);
	}
}

MissionMap.defaultProps = {
	missions: [],
	users: [],
	allowPanning: true,
	allowZooming: true,
	showCurrent: true,
};

MissionMap.propTypes = {
	missions: React.PropTypes.array,
	users: React.PropTypes.array,
	allowPanning: React.PropTypes.bool,
	allowZooming: React.PropTypes.bool,
	center: React.PropTypes.object,
	showCurrent: React.PropTypes.bool,
};
