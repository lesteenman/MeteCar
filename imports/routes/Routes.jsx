import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import App from '../ui/App.jsx';
import { AdminPageContainer } from '../containers/AdminPageContainer.jsx';

import TabsContainer from '../containers/TabsContainer.jsx';

import LoginPage from '../ui/LoginPage.jsx';
import SignupPage from '../ui/SignupPage.jsx';
import DashboardPage from '../ui/DashboardPage.jsx';
import MapPage from '../ui/MapPage.jsx';
import MissionsPage from '../ui/MissionsPage.jsx';
import PhotosPage from '../ui/PhotosPage.jsx';
import AdminDashboardPage from '../ui/AdminDashboardPage.jsx';

const requireAuth = (nextState, replace) => {
	if (!Meteor.loggingIn() && !Meteor.userId()) {
		console.log('Move to login page');
		replace({
			pathname: '/login'
		});
	}
};

const requireNoAuth = (nextState, replace) => {
	if (!Meteor.loggingIn() && !Meteor.userId()) {
		console.log('Would move to dashboard');
		// replace({
		// 	pathname: '/dashboard'
		// });
	}
};

export default renderRoutes = function() {
	return (
		<Router history={browserHistory}>
			<Route component={App}>
				<Redirect from="/" to="/dashboard" />

				<Route path="/login" component={LoginPage} onEnter={requireNoAuth} />
				<Route path="/signup" component={SignupPage} onEnter={requireNoAuth} />

				<Route component={TabsContainer}>
					<Route path="/dashboard" component={DashboardPage} onEnter={requireAuth} />
					<Route path="/map" component={MapPage} onEnter={requireAuth} />
					<Route path="/missions" component={MissionsPage} onEnter={requireAuth} />
					<Route path="/photos" component={PhotosPage} onEnter={requireAuth} />
				</Route>
				<Route component={AdminPageContainer}>
					<Route path="/admin" component={AdminDashboardPage} />
				</Route>
			</Route>
		</Router>
	);
};
