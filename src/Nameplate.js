import React from 'react';
import Radium from 'radium';

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
		const links = [
			{link: "https://github.com/cjol", name: "Github"},
			{link: "https://linkedin.com/in/cjolittle", name: "LinkedIn"},
			{link: "https://twitter.com/cjolittle", name: "Twitter"},
		]

		const styles = {
			link: {
				color: this.props.colors.base1,
				":hover":  {
					color:  this.props.colors.magenta
				}
			}
		}
		return (
			<div style={{
				position: "relative",
				width:"100%",
				top: "30%",
				left: "50%",
				transform: "translate(-50%, -50%)"
			}}>
				<img src="img/cjol.png" id="sig" style={{
					width: "auto",
					height: 230,
					paddingBottom: 20
				}}/>
				<div style={{
					textAlign: "center",
				}}>

					<h1 style={{display:"inline", fontSize:"1em"}}>
						Christopher J. O. Little (@cjol)
					</h1> |
					Entrepreneur &amp; Full-stack Developer |&nbsp;
					{links.map( (l,i) =>
						<span key={i}>
							{i>0?<span> | </span>:<span/>}
							<a href={l.link} key={i} target="_blank" style={styles.link}>
								{l.name} ↗
							</a>
						</span>
					)}
				</div>
			</div>
		);
	}
}
export default Radium(Nameplate);
