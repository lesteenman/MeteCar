import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import { TabBar, TabBarButton } from '../ui/UiComponents.jsx';
import FontIcon from 'material-ui/FontIcon';

const homeIcon = <FontIcon className="material-icons">home</FontIcon>;
const mapIcon = <FontIcon className="material-icons">location_on</FontIcon>;
const photosIcon = <FontIcon className="material-icons">photo</FontIcon>;
const missionsIcon = <FontIcon className="material-icons">view_list</FontIcon>;


export default class MainTabBar extends Component {
	render() {
		let buttons;
		if (this.props.team) {
			buttons = (
				<Span>
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
				</Span>
			);
		}

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
				<BottomNavigation>
					{buttons}
				</BottomNavigation>
			</MuiThemeProvider>
		);
	}
}
