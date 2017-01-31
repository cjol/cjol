import React from 'react';
import Radium from 'radium';
import color from 'color';

class Portfolio extends React.Component {
	constructor() {
		super();
		this.state = {
			count: 0,
			hover: false
		};
	}

	render() {

		const styles = {
			figure: {
				position: "relative",
				display: "inline-block",
				overflow: "hidden",
				margin: "10px 1%",
				minWidth: 300,
				maxWidth: 480,
				maxHeight: 360,
				width: "30%",
				height: 200,
				textAlign: "center",
				cursor: "pointer",
				backgroundColor: this.props.colors.base01
			},
			img: {
				position: "relative",
				display: "block",
				maxWidth: "112%",
				minHeight: "100%",
				opacity: 0.6,
				transition: "opacity 0.35s, transform 0.35s",
				transform: "translate3d(-30px,0,0) scale(1.12)",
				backfaceVisibility: "hidden",
			},
			link: {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: 1,
				textIndent: "200%",
				whiteSpace: "nowrap",
				fontSize: 0,
				opacity: 0
			},
			name: {
				wordSpacing: "-0.15em",
				fontWeight: 300,
				position: "absolute",
				right: 0,
				bottom: 0,
				padding: "5px 1.2em",
				color: this.props.colors.orange,
				backgroundColor: this.props.colors.base03
			},
			caption: {
				padding: "2em",
				color: this.props.colors.base1,
				textTransform: "uppercase",
				fontSize: "1.25em",
				backfaceVisibility: "hidden",
			},
			description: {
				margin:0,
				letterSpacing: 1,
				fontSize: "80%",
				padding: "0 10px 0 0",
				width: "60%",
				borderRight: `3px solid ${this.props.colors.base03}`,
				textAlign: "right",
				opacity: 0,
				transition: "opacity 0.35s, transform 0.35s",
				transform: "translate3d(-40px,0,0)",
				position: "absolute",
				top: 20,
				left: 20
			}
		}
		let hovers = {
			description: {
				opacity: 1,
				transform: "translate3d(0,0,0)"
			},
			img: {
				opacity: 0.3,
				transform: "translate3d(0,0,0) scale(1)"
			}
		}

		if (!this.state.hover) {
			hovers = {};
		}

		return (
			<figure key={`${this.props.item.slug}-figure`} style={styles.figure}
				onMouseEnter={()=>this.setState({hover:true})}
				onMouseLeave={()=>this.setState({hover:false})}
				>
				<img key={`${this.props.item.slug}-img`} style={[styles.img, hovers.img]} src={`./img/screenshots/${this.props.item.slug}.png`} alt={this.props.item.name} />
				<figcaption key={`${this.props.item.slug}-caption`} style={styles.caption}>
					<h2 key={`${this.props.item.slug}-name`} style={styles.name}>{this.props.item.name}</h2>
					<p key={`${this.props.item.slug}-p`} style={[styles.description, hovers.description]}>
						<span style={{backgroundColor:this.props.colors.base03, padding:"2px" }}>
							{this.props.item.desc}
						</span>
					</p>
					<a key={`${this.props.item.slug}-link`} href="#" style={styles.link}>View more</a>
				</figcaption>
			</figure>
		);
	}
}
export default Radium(Portfolio);
