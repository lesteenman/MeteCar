import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

// import '../imports/startup/accounts-config.js';
import renderRoutes from '../imports/routes/Routes.jsx';

import '../imports/api/Accounts.jsx';
import '../imports/api/Locations.jsx';
import '../imports/api/TeamAvatars.jsx';

import '../imports/startup/clientSubscriptions.jsx';

// Start location tracking
import '../imports/startup/geoLocation.jsx';
// Register for notifications
import '../imports/startup/notifications.jsx';

// Global helper functions
import '../imports/helpers/user.js';

Meteor.startup(() => {
	injectTapEventPlugin();
	render(renderRoutes(), document.getElementById('app-render-target'));
});
