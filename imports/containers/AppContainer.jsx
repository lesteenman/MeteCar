import App from '../ui/App.jsx';

import createContainer from '../helpers/createContainer.jsx';

export default createContainer(() => {
	return {
		user: Meteor.user(),
		userId: Meteor.userId()
	};
}, App);
