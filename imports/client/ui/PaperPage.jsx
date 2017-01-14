import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

export default class PaperPage extends Component {
	render() {
		let style = {
			margin: 18,
			padding: 12,
			textAlign: 'justify',
		}
		return (
			<Paper zDepth={3} style={style}>
				{this.props.children}
			</Paper>
		);
	}
}
