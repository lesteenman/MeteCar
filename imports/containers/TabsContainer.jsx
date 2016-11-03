import React from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AppBar from 'material-ui/AppBar';
import { TabBar, TabBarButton } from '../ui/UiComponents.jsx';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

import '../less/styles.scss';

import UserMenuContainer from '../ui/UserMenu.jsx';

const homeIcon = <FontIcon className="material-icons">home</FontIcon>;
const mapIcon = <FontIcon className="material-icons">location_on</FontIcon>;
const photosIcon = <FontIcon className="material-icons">photo</FontIcon>;
const missionsIcon = <FontIcon className="material-icons">view_list</FontIcon>;

export default class TabsContainer extends React.Component {
	constructor(props) {
		super(props);

		this.toggleMenuFunc = function() { console.log('Warn: Togglemenu not registered') };
		this.registerToggleMenu = this._registerToggleMenu.bind(this);
		this.toggleMenu = this._toggleMenu.bind(this);
	}

	_registerToggleMenu(func) {
		console.log('Register Toggle Menu', this.toggleMenu, func);
		this.toggleMenuFunc = func;
	}

	_toggleMenu() {
		this.toggleMenuFunc();
	}

	render() {
		console.log('Rendering dashboard!');

		// clone route components with keys so that they can
		// have transitions
		const clonedChildren = this.props.children && React.cloneElement(this.props.children, {
			key: location.pathname
		});

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
				<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
					<BottomNavigation>
						<Link to={'/dashboard'}>
							<BottomNavigationItem
								label="Home"
								icon={homeIcon}
								onTouchTap={() => console.log(0)}
							/>
						</Link>
						<Link to={'/map'}>
							<BottomNavigationItem
								label="Map"
								icon={mapIcon}
								onTouchTap={() => console.log(1)}
							/>
						</Link>
						<Link to={'/photos'}>
							<BottomNavigationItem
								label="Photos"
								icon={photosIcon}
								onTouchTap={() => console.log(2)}
							/>
						</Link>
						<Link to={'/missions'}>
							<BottomNavigationItem
								label="Missions"
								icon={missionsIcon}
								onTouchTap={() => console.log(3)}
							/>
						</Link>
					</BottomNavigation>
				</MuiThemeProvider>
			</div>
		);
	}
}
