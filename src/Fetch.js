import React from 'react';

class Fetch extends React.Component {
	constructor(props) {
		super();

		this.state = {};
		this.fetchData(props.url);
	}

	fetchData(url) {

		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.open('GET', url);
		xhr.onreadystatechange = () => {
			if (xhr.readyState>3) {
				if (xhr.status==200){
					const obj = JSON.parse(xhr.responseText);
					this.setState(obj);
					if (this.props.onSuccess) this.props.onSuccess(obj);
				} else {
					if(this.props.onError) this.props.onError(xhr);
				}
			}
		};
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.send();
	}

	children() {
		return React.Children.map(this.props.children, child => {
			return React.cloneElement(child, this.state);
		});
	}

	render() {
		return (
			<div style={this.props.style}>
				{this.children()}
			</div>
		);
	}
}

export default Fetch;
