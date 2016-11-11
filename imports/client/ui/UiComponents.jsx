import '../less/ui.scss';
import React from 'react';
import { Link } from 'react-router';
import TextField from 'material-ui/TextField';

/**
 * Contains general, small UI elements.
 */

const WideButton = (props) => {
	return (<button
		className={`${props.buttonType} button`}
		onClick={props.handler}
	>{props.children}</button>)
}

/* Button Types */
const ActionButton = (props) => <WideButton buttonType='action' {...props} />
const ExtraButton = (props) => <WideButton buttonType='extra' {...props} />

WideButton.propTypes = {
	buttonType: React.PropTypes.string.isRequired
};

class InputLine extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {value: ''};
		this.value = this._value.bind(this);
	}

	_value() {
		return this.textField.getValue();
	}

	render() {
		var onEnter = this.props.onEnter;
		var onKeyDown = function(e) {
			if (e.keyCode == 13) {
				if (onEnter) onEnter();
			}
		}

		return (
			<TextField
				errorText={this.props.error}
				floatingLabelText={this.props.label}
				fullWidth={true}
				multiLine={this.props.multiLine}
				onChange={this.props.onChange}
				onKeyDown={onKeyDown}
				ref={(input) => this.textField = input}
				type={this.props.type}
				defaultValue={this.props.value}
			></TextField>
		);
	}
}
InputLine.propTypes = {
	label: React.PropTypes.string.isRequired,
	error: React.PropTypes.string,
	onChange: React.PropTypes.func,
	onEnter: React.PropTypes.func,
	multiLine: React.PropTypes.bool,
	value: React.PropTypes.string,
}
InputLine.defaultProps = {
	type: 'text',
}


const TabBar = (props) => {
	return (<div className="tabbar">
		{props.children}
	</div>);
}

const TabBarButton = (props) => {
	let icon = "/assets/" + props.icon + ".icon.svg";
	return (
	<Link className='tabbar-button' to={props.target}>
		<img src={icon} />
	</Link>
	);
}



export { ActionButton, ExtraButton, InputLine, TabBar, TabBarButton };
