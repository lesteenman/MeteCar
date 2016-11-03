import React, { Component } from 'react';
import { browserHistory } from 'react-router';

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
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
				<Drawer
					docked={false}
					width={200}
					open={this.state.open}
					onRequestChange={(open) => this.setOpen(open)}
				>
					<MenuItem>Manage Team</MenuItem>
					<Divider />
					<MenuItem onTouchTap={this.logout}>Logout</MenuItem>
				</Drawer>
			</MuiThemeProvider>
		);
	}
}

export default createContainer(({ registerToggleMenu }) => {
	return {
		registerToggleMenu
	};
}, UserMenu);
