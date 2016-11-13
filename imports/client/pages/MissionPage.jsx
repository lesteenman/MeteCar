import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { createContainer } from 'meteor/react-meteor-data';

import { Missions } from '../../api/Missions.jsx';

class MissionPage extends Component {
	render() {
		if (!this.props.ready) return (<div></div>);

		console.log('Mission:', this.props.mission);

		// Page here...
		return (
			<div>
				<Helmet
					title='Mission title...'
				/>

				<p>missie beschrijving</p>
				<p>missie kaart</p>
			</div>
		);
	}
}

export default createContainer((props) => {
	let teamHandle = Meteor.subscribe('missions.team');
	let mission = Missions.findOne({_id: props.routeParams.id});

	return {
		ready: teamHandle.ready(),
		mission: mission,
	}
}, MissionPage);
