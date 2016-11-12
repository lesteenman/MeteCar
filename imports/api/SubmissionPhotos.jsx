import { FilesCollection } from 'meteor/ostrio:files';

const SubmissionPhotos = new FilesCollection({
	// debug: true,
	collectionName: 'avatars',
	allowClientCode: false,
	onBeforeUpload: function(file) {
		if (file.size <= 1024*1024*5 && /png|jpg|jpeg/i.test(file.extension)) {
			return true;
		} else {
			return 'Please upload image, max 5mb';
		}
	},
	onAfterUpload: function(file) {
		console.log('File Uploaded:', file);
	},
});

export default SubmissionPhotos;

if (Meteor.isServer) {
	SubmissionPhotos.denyClient();
	Meteor.publish('submission-photos.all', function() {
		return null;
		let cursor = SubmissionPhotos.find({});
		return cursor;
	});
}
