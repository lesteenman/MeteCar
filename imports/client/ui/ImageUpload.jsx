import React, { Component } from 'react';
import Images from '../../api/TeamAvatars.jsx';
import LinearProgress from 'material-ui/LinearProgress';

// Use: LinearProgress (material-ui/), flat Button on a Div with image preview
class ImageUpload extends Component {

	constructor(props) {
		super(props);

		this.upload = this._upload.bind(this);
		this.state = {
			file: ''
		}
	}

	_upload(callback) {
		if (this.uploader) {
			this.onFinishCb = callback;
			this.uploader.start();
		} else {
			callback(true);
		}
	}

	componentDidMount() {
		this.refs.input.onchange = (e) => {
			let file = e.currentTarget.files[0];
			if (file) {
				let reader = new FileReader();
				reader.onload = (e) => {
					this.setState({uploadedFile: e.target.result});
				};
				reader.readAsDataURL(file);

				this.uploader = this.props.collection.insert({
					file: file,
					streams: 'dynamic',
					chunkSize: 'dynamic',
				}, false);

				this.uploader.on('start', () => {
					console.log('Starting');
					this.setState({upload: this.uploader});
				});

				this.uploader.on('progress', (progress) => {
					console.log('Progress', progress);
					this.setState({progress: progress});
				});

				this.uploader.on('end', (error, fileObj) => {
					console.log('Done', error, fileObj);
					this.setState({upload: null, progress: null, uploadedFile: null});
					if (error) {
						this.setState({error: error.reason});
						if (this.onFinishCb) this.onFinishCb(false);
					} else {
						this.setState({file: fileObj.url});
						if (this.onFinishCb) this.onFinishCb(fileObj._id);
					}
				});
			}
		};
	}

	render() {
		let containerStyle = {
			width: '100%',
			height: '300px',
			border: '1px solid #eee',
			backgroundSize: 'cover',
			backgroundColor: 'transparent',
		};

		let image = this.state.uploadedFile || this.props.file;
		containerStyle.backgroundImage = 'url('+image+')';

		let iconStyle = {
			width: '100%',
			height: '100%',
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

		return (
			<div>
				<label htmlFor='image-input'>
					<div style={containerStyle}>
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
};

export default ImageUpload;
