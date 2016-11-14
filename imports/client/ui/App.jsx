import React, { Component } from 'react';
import Helmet from 'react-helmet';

import classNames from 'classnames';

import { createContainer } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import '../less/app.scss';
import '../less/styles.scss';
import '../less/transitions.scss';

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
		let verticalContainerClass = classNames({
			'vertical-container': true,
			'full-width': this.state.windowWidth <= 480,
		});
		let appContainerClass = classNames({
			'app-container': true,
			'full-height': this.state.windowWidth <= 480,
		});

		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
				<div className='app'>
					<Helmet title='Autospeurtocht 2017' />
					<div className='horizontal-container'><div className={constraintClass} />
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
	let usersHandle = Meteor.subscribe('users.all');
	let teamHandle = Meteor.subscribe('teams.all');
	let avatarsHandle = Meteor.subscribe('avatars.all');

	return {
		ready: teamHandle.ready() &&
			avatarsHandle.ready() &&
			usersHandle.ready() &&
			!Meteor.loggingIn(),
	}
}, App);
