import React, { Component } from 'react';

import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import UserMenuContainer from '../ui/UserMenu.jsx';
import TabBar from '../ui/TabBar.jsx';
import '../less/styles.scss';

export default class PageWithTabsContainer extends Component {
	render() {
		return (
			<div className='dashboard'>
				<div className='dashboard-container'>
					{this.props.children}
				</div>
				<TabBar />
			</div>
		);
	}
}
