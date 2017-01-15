import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import { createContainer } from 'meteor/react-meteor-data';

import { Team } from '/imports/api/Teams.jsx';
import { User } from '/imports/api/Accounts.jsx';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

class UserMenu extends Component {
	constructor(props, context) {
		super(props, context);
		this.setOpen = this._setOpen.bind(this);
		this.toggle = this._toggle.bind(this);
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
		if (!this.props.loading && this.props.team && this.props.team.captain == Meteor.userId()) {
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
			<Drawer
				docked={false}
				width={200}
				open={this.state.open}
				onRequestChange={(open) => this.setOpen(open)}
			>
				{teamOptions}
				<MenuItem onTouchTap={this.logout}>Logout</MenuItem>
			</Drawer>
		);
	}
}

export default createContainer(({ registerToggleMenu }) => {
	let teamId = User.current() ? User.current().team : undefined;
	let team = Team.findOne(teamId);

	return {
		registerToggleMenu,
		team: team,
	};
}, UserMenu);
