import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import AppContainer from '../containers/AppContainer.jsx';
import { UserPage, UnauthenticatedPage, AdminPage } from '../ui/AuthorizedContainer.jsx';

import EntryPage from '../ui/EntryPage.jsx';
import LoginPage from '../ui/LoginPage.jsx';
import SignupPage from '../ui/SignupPage.jsx';
import DashboardPage from '../ui/DashboardPage.jsx';
import MapPage from '../ui/MapPage.jsx';
import MissionsPage from '../ui/MissionsPage.jsx';
import PhotosPage from '../ui/PhotosPage.jsx';
import AdminDashboardPage from '../ui/AdminDashboardPage.jsx';

export default renderRoutes = function() {
	return (
		<Router history={browserHistory}>
			<Route component={AppContainer}>
				<Route path="/" component={EntryPage} />
				<Route component={UnauthenticatedPage}>
					<Route path="/login" component={LoginPage} />
					<Route path="/signup" component={SignupPage} />
				</Route>
				<Route component={UserPage}>
					<Route path="/dashboard" component={DashboardPage} />
					<Route path="/map" component={MapPage} />
					<Route path="/missions" component={MissionsPage} />
					<Route path="/photos" component={PhotosPage} />
				</Route>
				<Route component={AdminPage}>
					<Route path="/admin" component={AdminDashboardPage} />
				</Route>
			</Route>
		</Router>
	);
};
