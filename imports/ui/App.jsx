import React, { Component } from 'react';

import { createContainer } from '../helpers/createContainer.jsx';

export default class App extends Component {
    // clone route components with keys so that they can
    // have transitions
	render() {
		const clonedChildren = this.props.children && React.cloneElement(this.props.children, {
			key: location.pathname
		});

		return (
			<div id="container">
				<div id="content-container">
					<ReactCSSTransitionGroup
						transitionName="fade"
						transitionEnterTimeout={200}
						transitionLeaveTimeout={200}>
						{clonedChildren}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
};
