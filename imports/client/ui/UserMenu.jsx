import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import { createContainer } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

class UserMenu extends Component {
	constructor(props, context) {
		super(props, context);
		this.setOpen = this._setOpen.bind(this);
		this.logout = this._logout.bind(this);

		this.state = {
			open: false
		}
	}

	componentDidMount() {
		this.props.registerToggleMenu(this._toggle.bind(this));
	}

	_toggle() {
		this.setState({open: !this.state.open});
	}

	close() {
		this.setState({open: false});
	}

	_setOpen(open) {
		this.setState({open: open});
	}

	_logout() {
		Meteor.logout();
		browserHistory.push('/');
	}

	render() {
		let teamOptions;
		if (!this.props.loading && this.props.team) {
			teamOptions = (
				<span>
					<Link to='/team-manage'>
						<MenuItem onTouchTap={this.toggle}>Manage Team</MenuItem>
					</Link>
					<Divider />
				</span>
			);
		}
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
				<Drawer
					docked={false}
					width={200}
					open={this.state.open}
					onRequestChange={(open) => this.setOpen(open)}
				>
					{teamOptions}
					<MenuItem onTouchTap={this.logout}>Logout</MenuItem>
				</Drawer>
			</MuiThemeProvider>
		);
	}
}

export default createContainer(({ registerToggleMenu }) => {
	let userTeamHandle = Meteor.subscribe('Meteor.users.team');
	let team = Meteor.user() ? Meteor.user().team : undefined;
	let loggingIn = Meteor.loggingIn();
	let userTeamReady = userTeamHandle.ready();

	return {
		registerToggleMenu,
		team: team,
		loading: loggingIn || !userTeamReady
	};
}, UserMenu);
