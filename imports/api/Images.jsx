const Images = new Meteor.Files({
	debug: true,
	collectionName: 'Images',
	allowClientCode: false,
	onBeforeUpload: function(file) {
		if (file.size <= 1024*1024*5 && /png|jpg|jpeg/i.test(file.extension)) {
			return true;
		} else {
			return 'Please upload image, max 5mb';
		}
	},
});

if (Meteor.isServer) {
	Images.denyClient();
	Meteor.publish('images.teams', function() {
		
	});
}
