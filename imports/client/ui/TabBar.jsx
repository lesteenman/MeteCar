import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { Link } from 'react-router';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';

import { TabBar, TabBarButton } from './UiComponents.jsx';

const homeIcon = <FontIcon className="material-icons">home</FontIcon>;
const mapIcon = <FontIcon className="material-icons">location_on</FontIcon>;
const photosIcon = <FontIcon className="material-icons">photo</FontIcon>;
const missionsIcon = <FontIcon className="material-icons">view_list</FontIcon>;


export default class MainTabBar extends Component {
	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
				<BottomNavigation>
					<Link to={'/dashboard'}>
						<BottomNavigationItem
							label="Home"
							icon={homeIcon}
						/>
					</Link>
					<Link to={'/map'}>
						<BottomNavigationItem
							label="Map"
							icon={mapIcon}
						/>
					</Link>
					<Link to={'/photos'}>
						<BottomNavigationItem
							label="Photos"
							icon={photosIcon}
						/>
					</Link>
					<Link to={'/missions'}>
						<BottomNavigationItem
							label="Missions"
							icon={missionsIcon}
						/>
					</Link>
				</BottomNavigation>
			</MuiThemeProvider>
		);
	}
}
