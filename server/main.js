import { Meteor } from 'meteor/meteor';

import { Missions, createTestMissions } from '../imports/api/Missions.jsx';

import '../imports/api/Accounts.jsx';
import '../imports/api/Teams.jsx';
import '../imports/api/Locations.jsx';
import '../imports/api/TeamAvatars.jsx';
import './notifications.js';

// TODO: Create admin, missions, etc. on boot

import httpProxy from 'http-proxy';
import fs from 'fs';

Meteor.startup(() => {
	// process.env.ROOT_URL = 'https://steenman.me:3025';
	// httpProxy.createServer({
	// 	ws: true,
	// 	target: {
	// 		host: 'localhost',
	// 		port: 8019
	// 	},
	// 	ssl: {
	// 		key: Assets.getText('privkey.pem'),
	// 		cert: Assets.getText('cert.pem')
	// 	}
	// }).listen(8025);

	console.log('Startup...');

	insertAdminAccount();
	insertTestData();
});

function insertAdminAccount() {
	if (!Meteor.users.find({username: 'admin'}).count()) {
		console.log('Creating admin user...');
		let admin = Accounts.createUser({
			username: 'admin',
			email: 'eriksteenman+metecar-admin@gmail.com',
			password: 'godmode12',
			profile: {
				team: false,
				admin: true,
			}
		});
		console.log('User created');
	}
}

function insertTestData() {
	if (Missions.find({}).count() == 0) {
		createTestMissions();
	}
}
