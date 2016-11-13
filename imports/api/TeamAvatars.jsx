import { FilesCollection } from 'meteor/ostrio:files';

const TeamAvatars = new FilesCollection({
	debug: true,
	allowClientCode: false,
	collectionName: 'avatars',
	downloadRoute: '/img/avatars',
	storagePath: Meteor.absolutePath + '/../public/avatars/',
	public: true,
	onBeforeUpload: function(file) {
		if (file.size <= 1024*1024*5 && /png|jpg|jpeg/i.test(file.extension)) {
			return true;
		} else {
			return 'Please upload image, max 5mb';
		}
	},
});

export default TeamAvatars;

if (Meteor.isServer) {
	// TeamAvatars.denyClient();
	Meteor.publish('avatars.all', function() {
		return TeamAvatars.find({}).cursor;
	});
}
