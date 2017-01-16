import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';

import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/arrow-back';

import AppBar from 'material-ui/AppBar';

export default class PageWithMenuContainer extends Component {
	constructor(props) {
		super(props);
		this.currentTitle = "Autospeurtocht 2017";
		this.state = {
			title: this.currentTitle
		};

		this.back = this._back.bind(this);
		this.setTitle = this._setTitle.bind(this);
	}

	_registerToggleMenu(func) {
		this.toggleMenuFunc = func;
	}

	_back() {
		browserHistory.goBack();
	}

	_setTitle(title) {
		if (title && this.currentTitle !== title) {
			this.currentTitle = title;
			this.setState({title: title});
		}
	}

	render() {
		return (
			<div>
				<Helmet onChangeClientState={(newState) => this.setTitle(newState.title)} />
				<AppBar
					iconElementLeft={<IconButton><NavigationClose /></IconButton>}
					title={this.state.title}
					onLeftIconButtonTouchTap={this.back}
				/>
				<div style={{position: 'absolute', top: '64px', bottom: '0px', width: '100%'}}>
					{this.props.children}
				</div>
			</div>
		);

	}
}
