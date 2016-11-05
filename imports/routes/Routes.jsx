import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import App from '../ui/App.jsx';

import AdminPageContainer from '../containers/AdminPageContainer.jsx';
import UnauthenticatedContainer from '../containers/UnauthenticatedContainer.jsx';
import UnteamedUserContainer from '../containers/UnteamedUserContainer.jsx';
import TeamedUserContainer from '../containers/TeamedUserContainer.jsx';

import PageWithTabsContainer from '../containers/PageWithTabsContainer.jsx';
import PageWithMenuContainer from '../containers/PageWithMenuContainer.jsx';

import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';

import DashboardPage from '../pages/DashboardPage.jsx';
import MapPage from '../pages/MapPage.jsx';
import MissionsPage from '../pages/MissionsPage.jsx';
import PhotosPage from '../pages/PhotosPage.jsx';

import CreateTeamPage from '../pages/CreateTeamPage.jsx';
import PickTeamPage from '../pages/PickTeamPage.jsx';

import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';

export default renderRoutes = function() {
	return (
		<Router history={browserHistory}>
			<Route component={App}>
				<Redirect from="/" to="/dashboard" />

				<Route component={UnauthenticatedContainer}>
					<Route path="/login" component={LoginPage} />
					<Route path="/signup" component={SignupPage} />
				</Route>

				<Route component={PageWithMenuContainer}>
					<Route component={UnteamedUserContainer}>
						<Route path="/createTeam" component={CreateTeamPage} />
						<Route path="/pickTeam" component={PickTeamPage} />
					</Route>

					<Route component={TeamedUserContainer}>
						<Route component={PageWithTabsContainer}>
							<Route path="/dashboard" component={DashboardPage} />
							<Route path="/map" component={MapPage} />
							<Route path="/missions" component={MissionsPage} />
							<Route path="/photos" component={PhotosPage} />
						</Route>
					</Route>
				</Route>

				<Route component={AdminPageContainer}>
					<Route path="/admin" component={AdminDashboardPage} />
				</Route>
			</Route>
		</Router>
	);
};
