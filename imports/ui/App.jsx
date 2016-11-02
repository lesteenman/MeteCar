import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import '../less/app';
import '../less/transitions';

import { createContainer } from '../helpers/createContainer.jsx';

export default class App extends Component {
	// Keep track of window width
	constructor(props, context) {
		super(props, context);

		this.handleResize = this._handleResize.bind(this);
		this.state = {
			windowWidth: window.innerWidth
		}
	}

	_handleResize() {
		this.setState({windowWidth: window.innerWidth});
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render() {
		// clone route components with keys so that they can
		// have transitions
		const clonedChildren = this.props.children && React.cloneElement(this.props.children, {
			key: location.pathname
		});

		var constraintClass = this.state.windowWidth > 480 ? 'constraint-limit' : 'constraint-shrink';
		var verticalContainerClass = 'verticalContainer' + (this.state.windowWidth <= 480 ? ' fullwidth' : '');
		var appContainerClass = 'appContainer' + (this.state.windowWidth <= 480 ? 'fullHeight' : '');

		return (
			<div className='app'>
				<div className='horizontalContainer'><div className={constraintClass} />
				<div className={verticalContainerClass}><div className={constraintClass} />
					<div className={appContainerClass}>
						<ReactCSSTransitionGroup
							transitionName="page"
							transitionEnterTimeout={200}
							transitionLeaveTimeout={200}>
							{clonedChildren}
						</ReactCSSTransitionGroup>
					</div>
				<div className={constraintClass} /></div>
				<div className={constraintClass} /></div>
			</div>
		);
	}
};
