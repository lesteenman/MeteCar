import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';

import CameraIcon from 'material-ui/svg-icons/image/photo-camera';

// Use: LinearProgress (material-ui/), flat Button on a Div with image preview
class ImageUpload extends Component {

	constructor(props) {
		super(props);

		// console.log('re-create imageupload');

		this.state = {
			file: ''
		}
	}

	componentDidMount() {
		// console.log('imageupload did mount');
		this.refs.input.onchange = (e) => {
			let file = e.currentTarget.files[0];
			// console.log("A file was set", file);
			// if (file) {
			// 	this.props.collection.insert(file, 

				// let reader = new FileReader();
				// reader.onload = (e) => {
				// 	this.setState({uploadedFile: e.target.result});
				// };
				// reader.readAsDataURL(file);

				// this.uploader = this.props.collection.insert({
				// 	file: file,
				// 	streams: 'dynamic',
				// 	chunkSize: 'dynamic',
				// }, false);

				// this.uploader.on('start', () => {
				// 	// console.log('Starting');
				// 	this.setState({upload: this.uploader});
				// });

				// this.uploader.on('progress', (progress) => {
				// 	// console.log('Progress', progress);
				// 	this.setState({progress: progress});
				// });

				// this.uploader.on('end', (error, fileObj) => {
				// 	console.log('FileUpload Done', error, fileObj);
				// 	this.setState({upload: null, progress: null, uploadedFile: null});
				// 	if (error) {
				// 		this.setState({error: error.reason});
				// 		if (this.props.onUpload) this.props.onUpload(error);
				// 	} else {
				// 		this.setState({file: fileObj._id});
				// 		if (this.props.onUpload) this.props.onUpload(undefined, fileObj._id);
				// 	}
				// });

				// this.uploader.start();
			// }
		};
	}

	hasFile() {
		return !!this.refs.input.files[0];
	}

	upload(cb) {
		let file = this.refs.input.files[0];
		this.props.collection.insert(file, cb);
	}

	getFile() {
		return this.state.file;
	}

	render() {
		let image;
		if (this.state.uploadedFile) {
			image = this.state.uploadedFile;
		} else if (this.state.file) {
			let imageObj = this.props.collection.findOne(this.state.file);
			image = imageObj ? imageObj.url() : undefined;
		} else if (this.props.value) {
			let imageObj = this.props.collection.findOne(this.props.value);
			image = imageObj ? imageObj.url() : undefined;
		}

		let containerStyle = {
			position: 'relative',
			width: '100%',
			height: '300px',
			border: '1px solid rgb(91,93,101)',
			backgroundImage: 'url('+image+')',
			backgroundSize: 'contain',
			backgroundPosition: '50% 50%',
			backgroundRepeat: 'no-repeat',
			backgroundColor: 'transparent',
			cursor: 'pointer',
		};

		let iconStyle = {
			position: 'absolute',
			width: '75px',
			height: '75px',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%,-50%)',
		};

		let progressIndicator;
		if (this.state.upload && this.state.progress) {
			progressIndicator = (
				<LinearProgress
					mode='determinate'
					value={this.state.progress}
					style={{position: 'absolute', bottom: 0, width: '100%'}}
				/>
			);
		}

		let overlay;
		if (image) {
			overlay = (
				<div style={{
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					backgroundColor: 'rgba(0,0,0,0.4)',
				}} />
			);
		}

		return (
			<div>
				<label htmlFor='image-input'>
					<div style={containerStyle}>
						{overlay}
						<CameraIcon style={iconStyle} color='rgba(255,255,255,0.5)' />
						{progressIndicator}
					</div>
				</label>
				<input type='file' ref='input' id='image-input' style={{display: 'none'}} />
				<div style={{color: 'red'}}>{this.state.error}</div>
			</div>
		);
	}

};

// ImageUpload.defaultProps = {
// 	collection: TeamAvatars
// };

ImageUpload.propTypes = {
	height: React.PropTypes.number,
	collection: React.PropTypes.object.isRequired,
	value: React.PropTypes.string, // file ID on the given collection
	onUpload: React.PropTypes.func, // (error, file.id) => {}
};

export default ImageUpload;
