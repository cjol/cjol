import React from 'react';
import Radium from 'radium';

class PortfolioItem extends React.Component {

	render() {

		const styles = {
			img: {
				position: "relative",
				display: "block",
				minWidth: "112%",
				height: "100%",
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
			},
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

		if (!this.props.hover) {
			hovers = {};
		}

		return <figure style={styles.figure}
			onMouseEnter={()=>this.setState({hover:true})}
			onMouseLeave={()=>this.setState({hover:false})}
			>
				<img key={`${this.props.slug}-img`} style={[styles.img, hovers.img]} src={this.props.img} alt={this.props.name} />
				<figcaption key={`${this.props.slug}-caption`} style={styles.caption}>
					<h2 key={`${this.props.slug}-name`} style={styles.name}>{this.props.name}</h2>
					<p key={`${this.props.slug}-p`} style={[styles.description, hovers.description]}>
						<span style={{backgroundColor:this.props.colors.base03, padding:"2px" }}>
							{this.props.desc}
						</span>
					</p>
					<a key={`${this.props.slug}-link`} href="#" style={styles.link} onClick={(e) => this.props.setModal(this.props)}>View more</a>
				</figcaption>
			</figure>
	}
}

export default Radium(PortfolioItem);
