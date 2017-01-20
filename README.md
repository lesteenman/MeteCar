MeteCar
=======
This is a simple Meteor application that will be used for a yearly event at a local organization. The idea behind the event is that a number of tasks are spread throughout the Netherlands, and you have to drive there asap to complete them.

There are various mission types. Currently, these are location missions (be near a certain location), photo missions (submit a photo of a given task), and 'puzzle' missions, which are simply a question.

Requirements
============
- Meteor
- TODO: find out what else is needed

Running
============
Todo

TODO
=======

Next Up
-------

[x] Move to collectionFS for files
[x] Test new file upload with avatars
[x] Test thumb method
[ ] Cluster map icons (use markerClusterer of google maps - new implementation in the maps lib)
[ ] Implement new files system for submissions (upload with cb)

[ ] Use team icons on the map
	[ ] Possible using collectionFS
[ ] Completed missions get a green icon on the map

[ ] Dialog for approving/disapproving missions
[ ] FIXME: Setting a mission as completed does not stream next mission to the team
[ ] Switch a photo mission to 'results publicized'

[ ] Modify a team's members (admin and captains)

[ ] Create question mission (puzzle)
[ ] Create photo mission
[ ] Create location mission

[ ] Implement location missions submission
[ ] Implement puzzle missions submission
[ ] Publicize a mission's photos to everyone
[ ] Implement photo rating(?)
[ ] Scoring

[ ] Approve new team members (captain and admin both)
[ ] Show who succeeded when after results are publicized for teams
[ ] Show a bubble for unapproved photos for Admin

[ ] Fix automatic zoom and focus of map
[ ] Optionally include current session's current location in map centering

Later
-----
- Android app
- Make notifications work
- iOS app
- let it work properly as a chrome web app?

Much later
----------
More beautiful desktop version which can be used for e.g. creating functions

Notifications
-------------
Admins: each submission
Team: submissions by your teams


Usage/License
=============
The code in this repository is open to use for private and commercial usage, at least for now. However, giving credits to me would be greatly appreciated if you use a considerable amount of my base code.

If you would like to use the full project for an event of your own, please contact me.
