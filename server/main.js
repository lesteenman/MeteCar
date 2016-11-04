import { Meteor } from 'meteor/meteor';

import '../imports/api/Accounts.jsx';
import '../imports/api/Location.jsx';

Meteor.startup(() => {
	// try {
	// 	SSLProxy({
	// 		port: 8020,
	// 		ssl: {
	// 			key: Assets.getText('ssl/key.pem'),
	// 			cert: Assets.getText('ssl/cert.pem')
	// 		}
	// 	});
	// } catch (err) {
	// 	console.error('Server startup error: ', err);
	// 	exit();
	// }
});
