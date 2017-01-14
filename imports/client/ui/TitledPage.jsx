import React, { Component } from 'react';
import Helmet from 'react-helmet'

export default class TitledPage extends Component {
	render() {
		let title = this.getTitle();
		let helmet = (<Helmet title={title} />);

		let page;
		if (this.isReady()) {
			page = this.pageRender();
		};
		this.__titledpage_rendered__ = true;
		return (
			<div>
				{helmet}
				{page}
			</div>
		);
	}

	componentWillMount() {
		console.log('Will mount');
		this.__titledpage_rendered__ = false;
		this.__titledpage_titleset__ = true;
	}

	componentDidMount() {
		if (!this.__titledpage_rendered__) {
			console.error("WARNING: It seems you are overriding the 'render' method of a TitledPage ('"+this.constructor.name+"'). Use the PageRender() function intead!");
		}
		if (!this.__titledpage_titleset__) {
			console.error("WARNING: No title was set for TitledPage '"+this.constructor.name+"'. Define a 'getTitle' function to do so. Using the default title.");
		}
	}

	pageRender() {
		return (
			<div>NOTE: It seems you have not implemented your pageRender method!</div>
		);
	}

	getTitle() {
		console.log('Using the default getTitle');
		this.__titledpage_titleset__ = false;
		return "Autospeurtocht 2017";
	}

	isReady() {
		return true;
	}
}
