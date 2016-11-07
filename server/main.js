import { Meteor } from 'meteor/meteor';

import { Missions, createTestMissions } from '../imports/api/Missions.jsx';

import '../imports/api/Accounts.jsx';
import '../imports/api/Teams.jsx';
import '../imports/api/Locations.jsx';

// TODO: Create admin, missions, etc. on boot

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

	insertAdminAccount();
	insertTestData();
});

function insertAdminAccount() {
	if (!Meteor.users.find({name: 'admin'})) {
		console.log('Creating admin user...');
	}
}

function insertTestData() {
	if (Missions.find({}).count() == 0) {
		createTestMissions();
	}
}
