import React, { Component } from 'react';
import Helmet from 'react-helmet';

export default class DashboardPage extends Component {
	render() {
		return (
			<div>
				<Helmet title='Dashboard' />
				Dashboard!
			</div>
		);
	}
}
