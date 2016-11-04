import React, { Component } from 'react';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { Team } from '../api/Teams.jsx';
import { ActionButton } from '../ui/UiComponents.jsx';
import '../less/form.scss';

class PickTeamPage extends Component {
	render() {
		let teams = [];

		for (let i = 0; i < this.props.teams.length; i++) {
			let team = this.props.teams[i];
			teams.push(
				<div>
					team.name
				</div>
			);
		}

		return (
			<div className='form-container'>
				{teams}

				<Link to={'createTeam'}>
					<ActionButton>Create Team</ActionButton>
				</Link>
			</div>
		);
	}
}

export default createContainer(() => {
	return {
		teams: Team.find().fetch()
	}
}, PickTeamPage);
