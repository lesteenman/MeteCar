import React, { Component } from 'react';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import UserMenuContainer from '../ui/UserMenu.jsx';
import TabBar from '../ui/TabBar.jsx';
import '../less/styles.scss';

export default class PageWithTabsContainer extends Component {
	render() {
		let active = this.props.location.pathname.slice(1);
		console.log('Active page:', active);

		return (
			<div className='dashboard'>
				<TabBar page={active}/>
				<div className='dashboard-container'>
					{this.props.children}
				</div>
			</div>
		);
	}
}
