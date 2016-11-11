// import { Push } from 'meteor/raix:push';

if (Meteor.isClient) {
	Push.Configure({
		android: {
			senderID: 1473016929561,
			alert: true,
			badge: true,
			sound: true,
			vibrate: true,
			clearNotifications: true,
			// icon: '',
			// iconColor: '',
		},
		// ios: {
		// 	alert: true,
		// 	badge: true,
		// 	sound: true,
		// },
	});
}
