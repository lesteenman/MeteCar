import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

import { List, ListItem } from 'material-ui/List';

export default class AdminDashboardPage extends Component {
	render() {
		return (
			<div>
				<Helmet title='Admin' />
				<List>
					<Link to='/admin/teams'>
						<ListItem
							primaryText="Teams"
							secondaryText="Manage teams' missions, users, etc."
						/>
					</Link>
				</List>
			</div>
		);
	}
}
