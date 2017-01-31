import React from 'react';

/**
 * A nameplate: Just shows my name and some links
 */
class Nameplate extends React.Component {
	constructor() {
		super();
		this.state = {
		};
	}

	render() {
		return (
			<div style={{backgroundColor:"#002B36",color:"#839496", fontFamily:"monospace", height:"100%", border: "10px solid #839496", margin:0, boxSizing:"border-box", textAlign:"center", position:"relative"}}>
				<div style={{height:20, width:"100%", textAlign: "center", lineHeight:"20px", verticalAlign:"middle", position:"absolute", "top": "50%", "margin-top":-10}}>
					Christopher J. O. Little (@cjol) | Entrepreneur &amp; Full-stack Developer&nbsp;|&nbsp;
					<a href="https://github.com/cjol" target="_blank" style={{color:"#839496"}}>Github ↗</a>&nbsp;|&nbsp;
					<a href="https://linkedin.com/in/cjolittle" target="_blank" style={{color:"#839496"}}>LinkedIn ↗</a>&nbsp;
				</div>
			</div>
		);
	}
}
export default Nameplate;
