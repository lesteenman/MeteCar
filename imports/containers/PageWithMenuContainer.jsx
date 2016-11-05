import React, { Component } from 'react';
import Helmet from 'react-helmet';

import UserMenuContainer from '../ui/UserMenu.jsx';

import AppBar from 'material-ui/AppBar';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default class PageWithMenuContainer extends Component {
	constructor(props) {
		super(props);
		this.currentTitle = "Autospeurtocht 2017";
		this.state = {
			title: this.currentTitle
		};

		this.toggleMenuFunc = function() { console.log('Warn: Togglemenu not registered') };
		this.registerToggleMenu = this._registerToggleMenu.bind(this);
		this.toggleMenu = this._toggleMenu.bind(this);
		this.setTitle = this._setTitle.bind(this);
	}

	_registerToggleMenu(func) {
		this.toggleMenuFunc = func;
	}

	_toggleMenu() {
		this.toggleMenuFunc();
	}

	_setTitle(title) {
		if (title && this.currentTitle !== title) {
			this.currentTitle = title;
			this.setState({title: title});
		}
	}

	render() {
		return (
			<div>
				<UserMenuContainer ref='menu' registerToggleMenu={this.registerToggleMenu} />
				<Helmet onChangeClientState={(newState) => this.setTitle(newState.title)} />
				<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
					<AppBar
						title={this.state.title}
						onLeftIconButtonTouchTap={this.toggleMenu}
					/>
				</MuiThemeProvider>
				{this.props.children}
			</div>
		);

	}
}
