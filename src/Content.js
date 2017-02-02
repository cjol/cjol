import React from 'react';
import Nameplate from './Nameplate.js';
import Portfolio from './Portfolio.js';
import PortfolioModal from './PortfolioModal.js';

class Content extends React.Component {
	constructor() {
		super();
		this.state = {
			modalItem: null
		};
	}

	render() {

		const colors =  {
			base03: "#002b36",
			base02: "#073642",
			base01: "#586e75",
			base00: "#657b83",
			base0: "#839496",
			base1: "#93a1a1",
			base2: "#eee8d5",
			base3: "#fdf6e3",
			yellow: "#b58900",
			orange: "#cb4b16",
			red: "#dc322f",
			magenta: "#d33682",
			violet: "#6c71c4",
			blue: "#268bd2",
			cyan: "#2aa198",
			green: "#859900",
		}
		const setModal = i => this.setState({modalItem: i});

		return <div style={{
			backgroundColor: colors.base03,
			color: colors.base0,
			fontFamily:"monospace",
			height:"100%",
			border: `10px solid ${colors.base0}`,
			margin:0,
			boxSizing:"border-box",
			textAlign:"center",
			overflowY:"auto",
			position:"relative"}}>

			<Nameplate colors={colors}/>

			<Portfolio colors={colors} setModal={setModal}/>

			<PortfolioModal colors={colors} item={this.state.modalItem} setModal={setModal}/>
		</div>

	}
}
export default Content;
