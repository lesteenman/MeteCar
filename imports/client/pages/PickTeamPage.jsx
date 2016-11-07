import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import classNames from 'classnames';

import { createContainer } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { Card, CardHeader, CardText } from 'material-ui/Card';

import { Teams } from '../../api/Teams.jsx';
import { ActionButton, ExtraButton } from '../ui/UiComponents.jsx';
import '../less/form.scss';
import '../less/team-picker.scss';

class PickTeamPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			picked: false
		};
		this.pick = this._pick.bind(this);
		this.submit = this._submit.bind(this);
	}

	_pick(team) {
		this.setState({picked: team});
	}

	_submit() {
		if (!this.state.picked) return;

		Meteor.call('teams.pick', this.state.picked, (error) => {
			if (error) {
				this.setState({error: error.reason});
			}
		});
	}

	render() {
		if (!this.props.ready) return (<div></div>);
		let teams = [];

		for (let i = 0; i < this.props.teams.length; i++) {
			let team = this.props.teams[i];
			let cardClass = classNames({
				'pick-team-card': true,
				'picked': this.state.picked === team._id
			});
			console.log('Team:', team);

			teams.push(
				<MuiThemeProvider key={team.name} muiTheme={getMuiTheme(darkBaseTheme)}>
					<Card
						onTouchTap={this.pick.bind(this, team._id)}
						style={{backgroundColor: ''}}
						className={cardClass}>
						<CardHeader title={team.name} />
						<CardText>
							{team.description}
						</CardText>
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

				{teams.length ? <ActionButton handler={this.submit}>Confirm</ActionButton> : <div>No teams yet</div>}
				<Link to={'team-create'}>
					<ExtraButton>Create Team</ExtraButton>
				</Link>
			</div>
		);
	}
}

export default createContainer(() => {
	let teamHandle = Meteor.subscribe('teams.all');
	return {
		teams: Teams.find().fetch(),
		ready: teamHandle.ready(),
	}
}, PickTeamPage);
