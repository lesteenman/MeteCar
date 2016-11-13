import React, { Component } from 'react';
import Helmet from 'react-helmet';

export default class DashboardPage extends Component {
	render() {
		return (
			<div>
				<Helmet title='Dashboard' />
				Hier gaat een awesome dashboard komen!
				<div style={{color: 'red'}}>
					Oh yeah
				</div>
			</div>
		);
	}
}
