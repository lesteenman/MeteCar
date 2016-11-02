import React, { Component } from 'react';
import { browserHistory } from 'react-router'


export default class EntryPage extends Component {
	componentWillMount() {
		if (this.props.userId) {
			browserHistory.push('/dashboard')
		} else {
			browserHistory.push('/login')
		}
	}

	render() {
		return (<div>Loading...</div>);
	}
}
