import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { createContainer } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import '../less/app';
import '../less/transitions';

class App extends Component {
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
		if (!this.props.ready) return (<div></div>);

		var constraintClass = this.state.windowWidth > 480 ? 'constraint-limit' : 'constraint-shrink';
		var verticalContainerClass = 'verticalContainer' + (this.state.windowWidth <= 480 ? ' fullwidth' : '');
		var appContainerClass = 'appContainer' + (this.state.windowWidth <= 480 ? 'fullHeight' : '');

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
				<div className='app'>
					<Helmet title='Autospeurtocht 2017' />
					<div className='horizontalContainer'><div className={constraintClass} />
					<div className={verticalContainerClass}><div className={constraintClass} />
						<div className={appContainerClass}>
							{this.props.children}
						</div>
					<div className={constraintClass} /></div>
					<div className={constraintClass} /></div>
				</div>
			</MuiThemeProvider>
		);
	}
};

export default createContainer(() => {
	let teamHandle = Meteor.subscribe('teams.all');
	let avatarsHandle = Meteor.subscribe('avatars.all');

	return {
		ready: teamHandle.ready() && avatarsHandle.ready(),
	}
}, App);
