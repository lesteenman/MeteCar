import React, { Component } from 'react';

import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AppBar from 'material-ui/AppBar';

import UserMenuContainer from '../ui/UserMenu.jsx';
import TabBar from '../ui/TabBar.jsx';
import '../less/styles.scss';

export default class TabsContainer extends Component {
	constructor(props) {
		super(props);

		this.toggleMenuFunc = function() { console.log('Warn: Togglemenu not registered') };
		this.registerToggleMenu = this._registerToggleMenu.bind(this);
		this.toggleMenu = this._toggleMenu.bind(this);
	}

	_registerToggleMenu(func) {
		this.toggleMenuFunc = func;
	}

	_toggleMenu() {
		this.toggleMenuFunc();
	}

	render() {
		// clone route components with keys so that they can
		// have transitions
		const clonedChildren = this.props.children && React.cloneElement(this.props.children, {
			key: location.pathname
		});

		// TODO: Create a team management page where you can add users to your team.
		// TODO: Add a 'validate member of team' feature where the captain is asked for confirmation
		// TODO: Send a push notification to the team captain if someone wants to join

		return (
			<div className='dashboard'>
				<UserMenuContainer ref='menu' registerToggleMenu={this.registerToggleMenu} />

				<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
					<AppBar
						title="Autospeurtocht"
						onLeftIconButtonTouchTap={this.toggleMenu}
					/>
				</MuiThemeProvider>
				<div className='dashboard-container'>
					{clonedChildren}
				</div>
				<TabBar />
			</div>
		);
	}
}
