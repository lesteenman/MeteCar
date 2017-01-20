var createSquareThumb = function(fileObj, readStream, writeStream) {
	  var size = '40';
	  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
};

const TeamAvatars = new FS.Collection("avatars", {
	stores: [
		new FS.Store.FileSystem("full", {
			path: Meteor.absolutePath + "/../public/avatars/",
		}),
		new FS.Store.FileSystem("thumbs", {
			path: Meteor.absolutePath + "/../public/avatars/thumbs/",
			transformWrite: createSquareThumb
		}),
	],
});
export default TeamAvatars;

if (Meteor.isServer) {
	TeamAvatars.allow({
		'insert': function() { return true; },
		'download': function() { return true; },
	});

	Meteor.publish('avatars.all', function() {
		return TeamAvatars.find({});
	});
}
