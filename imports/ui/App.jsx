import React, { Component } from 'react';

import '../less/app';
import '../less/transitions';

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
		var constraintClass = this.state.windowWidth > 480 ? 'constraint-limit' : 'constraint-shrink';
		var verticalContainerClass = 'verticalContainer' + (this.state.windowWidth <= 480 ? ' fullwidth' : '');
		var appContainerClass = 'appContainer' + (this.state.windowWidth <= 480 ? 'fullHeight' : '');

		return (
			<div className='app'>
				<div className='horizontalContainer'><div className={constraintClass} />
				<div className={verticalContainerClass}><div className={constraintClass} />
					<div className={appContainerClass}>
						{this.props.children}
					</div>
				<div className={constraintClass} /></div>
				<div className={constraintClass} /></div>
			</div>
		);
	}
};
