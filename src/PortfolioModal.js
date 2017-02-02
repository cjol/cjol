import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedLight } from 'react-syntax-highlighter/dist/styles';

import React from 'react';
import Radium from 'radium';
import color from 'color';
import Fetch from  'react-fetch'

class PortfolioModal extends React.Component {
	constructor() {
		super();
		this.state = {
		};
	}

	render() {
		if (this.props.item === null) return <div />;
		return <div
			style= {{
				backgroundColor: color(this.props.colors.base03).fade(0.1),
				position:"fixed",
				zIndex: 10,
				bottom: 10,
				right:10,
				top:10,
				left:10,
			}}
			onClick={e=> this.props.setModal(null)}
		>
			<div
				style={{
					width:"80%",
					textAlign: "left",
					overflowY: "auto",
					position: "absolute",
					top:0,
					bottom:0,
					left: "10%",
					padding:15
				}}
			>
				<PortfolioModalInner {...this.props.item}/>
			</div>
		</div>;
	}
}

class PortfolioModalInner extends React.Component {
	constructor() {
		super();
		this.state = {
		};
	}

	render() {

		const {code, codeLanguage, description, name, codeDescription, img} = this.props;

		return <div style={{maxWidth:1024, margin:"auto"}}>

			{/* header */}
			<h1>{name}</h1>
			<div style={{width:"48%", padding:"1%",position:"relative", float:"left"}}>
				<div dangerouslySetInnerHTML={{__html: description}}></div>
			</div>

			{/* image */}
			<div style={{width:"48%", padding:"1%", position:"relative", float:"left"}}>
				<img src={img} style={{maxWidth:"100%"}}/>
			</div>

			{/* code sample */}
			<h2 style={{clear:"both"}}>Code Highlights</h2>
			<div>
				<p>{codeDescription}</p>
				{code ?
					<SyntaxHighlighter lineNumberStyle={{color:this.props.colors.base1}} language={codeLanguage} style={solarizedLight} showLineNumbers={true} children={code} />
				: <div />
				}
			</div>
		</div>
	}
}

export default PortfolioModal;
