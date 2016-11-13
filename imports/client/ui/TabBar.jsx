import React, { Component } from 'react';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { browserHistory } from 'react-router'

import { Link } from 'react-router';
// import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';

import { TabBar, TabBarButton } from './UiComponents.jsx';

const homeIcon = <FontIcon className="material-icons">home</FontIcon>;
const mapIcon = <FontIcon className="material-icons">location_on</FontIcon>;
const photosIcon = <FontIcon className="material-icons">photo</FontIcon>;
const missionsIcon = <FontIcon className="material-icons">view_list</FontIcon>;


export default class MainTabBar extends Component {
	onPage(page) {
		browserHistory.push('/'+page);
	}

	render() {
		console.log('Active Tab:', this.props.page);
		return (
			<div>
				<Tabs value={this.props.page}>
					<Tab
						onActive={this.onPage.bind(this, 'dashboard')}
						value="dashboard"
						label="Home"
						/*icon={homeIcon}*/
					/>
					<Tab
						onActive={this.onPage.bind(this, 'map')}
						value="map"
						label="Map"
						/*icon={mapIcon}*/
					/>
					<Tab
						onActive={this.onPage.bind(this, 'photos')}
						value="photos"
						label="Photos"
						/*icon={photosIcon}*/
					/>
					<Tab
						onActive={this.onPage.bind(this, 'missions')}
						value="missions"
						label="Missions"
						/*icon={missionsIcon}*/
					/>
					/* <Tab label="Admin" /> */
				</Tabs>
			</div>
		);
	}
}
