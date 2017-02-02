import React from 'react';
import PortfolioItem from './PortfolioItem';
import Fetch from './Fetch'

class Portfolio extends React.Component {
	render() {
		let items = <div />
		if (this.props.items) {
			items =
				this.props.items
					.sort( (a,b) => a.order - b.order )
					.map( (p,i) =>
						<PortfolioItem key={i} {...p} colors={this.props.colors} setModal={this.props.setModal}/>
					)
		}
		return (
			<div style={{
				position: "relative",
				top: "35%",
				margin: "auto",
				maxWidth: 1024,
				marginBottom: 100
			}}>
			 	{items}
			</div>
		);
	}
}

class PortfolioHolder extends React.Component {
	render() {
		return <Fetch url="/api" style={{
			position: "relative",
			top: "35%",
		}}>
			<Portfolio {...this.props}/>
		</Fetch>
	}
}

export default PortfolioHolder;
