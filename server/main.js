import { Meteor } from 'meteor/meteor';

import '../imports/api/Accounts.jsx';
import '../imports/api/Teams.jsx';
import '../imports/api/Location.jsx';

import httpProxy from 'http-proxy';
import fs from 'fs';

Meteor.startup(() => {
	httpProxy.createServer({
		ws: true,
		target: {
			host: 'localhost',
			port: 8019
		},
		ssl: {
			key: Assets.getText('key.pem'),
			cert: Assets.getText('cert.pem')
		}
	}).listen(8025);
});
