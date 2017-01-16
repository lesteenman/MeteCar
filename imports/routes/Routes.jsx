import React from 'react';
import { Router, Route, Redirect, browserHistory } from 'react-router';

import App from '../client/ui/App.jsx';

import AdminPageContainer from '../client/containers/AdminPageContainer.jsx';
import UnauthenticatedContainer from '../client/containers/UnauthenticatedContainer.jsx';
import UnteamedUserContainer from '../client/containers/UnteamedUserContainer.jsx';
import TeamedUserContainer from '../client/containers/TeamedUserContainer.jsx';

import PageWithTabsContainer from '../client/containers/PageWithTabsContainer.jsx';
import PageWithMenuContainer from '../client/containers/PageWithMenuContainer.jsx';
import PageWithBackButtonContainer from '../client/containers/PageWithBackButtonContainer.jsx';

import LoginPage from '../client/pages/LoginPage.jsx';
import SignupPage from '../client/pages/SignupPage.jsx';

import DashboardPage from '../client/pages/DashboardPage.jsx';
import MapPage from '../client/pages/MapPage.jsx';
import MissionsPage from '../client/pages/MissionsPage.jsx';
import MissionPage from '../client/pages/MissionPage.jsx';
import PhotosPage from '../client/pages/PhotosPage.jsx';

import ManageTeamPage from '../client/pages/ManageTeamPage.jsx';
import CreateTeamPage from '../client/pages/CreateTeamPage.jsx';
import PickTeamPage from '../client/pages/PickTeamPage.jsx';

import AdminDashboardPage from '../client/pages/AdminDashboardPage.jsx';
import AdminTeamsPage from '../client/pages/AdminTeamsPage.jsx';
import AdminTeamPage from '../client/pages/AdminTeamPage.jsx';
import AdminTeamMissionsPage from '../client/pages/AdminTeamMissionsPage.jsx';

export default renderRoutes = function() {
	return (
		<Router history={browserHistory}>
			<Route component={App}>
				<Redirect from="/" to="/dashboard" />

				<Route component={UnauthenticatedContainer}>
					<Route path="/login" component={LoginPage} />
					<Route path="/signup" component={SignupPage} />
				</Route>

				<Route component={PageWithBackButtonContainer}>
					<Route component={TeamedUserContainer}>
						<Route path="/missions/:id" component={MissionPage} />
					</Route>
					<Route component={AdminPageContainer}>
						<Route path="/admin/teams/:id" component={AdminTeamPage} />
						<Route path="/admin/teams/:id/missions" component={AdminTeamMissionsPage} />
					</Route>
				</Route>

				<Route component={PageWithMenuContainer}>
					<Route component={UnteamedUserContainer}>
						<Route path="/team-create" component={CreateTeamPage} />
						<Route path="/team-pick" component={PickTeamPage} />
					</Route>

					<Route component={TeamedUserContainer}>
						<Route path="/team-manage" component={ManageTeamPage} />
					</Route>
					<Route component={PageWithTabsContainer}>
						<Route component={TeamedUserContainer}>
							<Route path="/dashboard" component={DashboardPage} />
							<Route path="/map(/:centerType/:centerId)" component={MapPage} />
							<Route path="/missions" component={MissionsPage} />
							<Route path="/photos" component={PhotosPage} />
						</Route>
						<Route component={AdminPageContainer}>
							<Route path="/admin" component={AdminDashboardPage} />
							<Route path="/admin-teams" component={AdminTeamsPage} />
						</Route>
					</Route>
				</Route>

			</Route>
		</Router>
	);
};
