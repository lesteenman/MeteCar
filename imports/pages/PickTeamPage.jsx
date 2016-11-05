import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import { Team } from '../api/Teams.jsx';
import { ActionButton } from '../ui/UiComponents.jsx';
import '../less/form.scss';

class PickTeamPage extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.pick = this._pick.bind(this);
	}

	_pick(team) {
		Meteor.call('teams.pick', team, (error) => {
			if (error) {
				this.setState({error: error.reason});
			}
		});
	}

	render() {
		let teams = [];

		for (let i = 0; i < this.props.teams.length; i++) {
			let team = this.props.teams[i];
			teams.push(
				<MuiThemeProvider key={team.name} muiTheme={getMuiTheme(darkBaseTheme)}>
					<Card onTouchTap={this.pick.bind(this, team.name)} style={{cursor: 'pointer'}}>
						<CardHeader title={team.name} />
						<CardText>
							{team.description}
						</CardText>
						<CardActions expandable={true}>
							<FlatButton label="Pick" />
							<FlatButton label="Cancel" />
						</CardActions>
					</Card>
				</MuiThemeProvider>
			);
		}

		return (
			<div className='form-container'>
				<Helmet title="Pick a team" />

				<div style={{margin: '10px 0'}}>
					{teams}
				</div>
				<div style={{color: 'red'}}>{this.state.error}</div>

				<Link to={'createTeam'}>
					<ActionButton>Create Team</ActionButton>
				</Link>
			</div>
		);
	}
}

export default createContainer(() => {
	Meteor.subscribe('Meteor.teams');
	return {
		teams: Team.find().fetch()
	}
}, PickTeamPage);
