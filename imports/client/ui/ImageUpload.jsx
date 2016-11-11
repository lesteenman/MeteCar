

// Use: LinearProgress (material-ui/), flat Button on a Div with image preview
class ImageUpload extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.refs.input.onChange(function(e) {
			console.log('Changed: ', e);
		});
	}

	render() {
		let containerStyle = {
			width: '100%',
			height: '300px',
			backgroundSize: 'cover',
			backgroundColor: 'transparent',
		};

		let image;
		if (image) {
			containerStyle.backgroundImage = image;
		}

		let iconStyle = {
			width: '100%',
			height: '100%',
		};

		return (
			<div style={containerStyle}>
				<input
					type='file'
					ref='input'
				/>
			</div>
		);
	}

}

ImageUpload.propTypes = {
	height: React.PropTypes.int
};

export default ImageUpload;
