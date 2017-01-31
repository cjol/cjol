import React from 'react';
import PortfolioItem from './PortfolioItem';

/**
 * A counter button: tap the button to increase the count.
 */
class Portfolio extends React.Component {
	constructor() {
		super();
		this.state = {
		};
	}

	render() {
		const pieces = [
			{
				name: "Manner",
				slug: "manner",
				desc: "Advanced A/B testing and analytics platform, built to automatically optimise chatbot conversations",
				description: "bar the second",
			},
			{
				name: "Location Finder",
				slug: "location",
				desc: "Borne of frustration, a few-hour API mashup helping identify the most cost-effective commute options",
				description: "bar the second",
			},
			{
				name: "Grapht",
				slug: "grapht",
				desc: "Hybrid graph / relational database offering faster performance than either alternative can offer alone",
				description: "foo bar the first",
			},
			{
				name: "LiveMap",
				slug: "livemap",
				desc: "High-throughput streaming system to process live mouse-movements and calculate a heatmap of activity",
				description: "bar the second",
			},
			{
				name: "JSTyper",
				slug: "jstyper",
				desc: "Formally verified JavaScript type-checker and \"gradual typing\" compiler",
				description: "foo bar the first",
			},
			{
				name: "Mabel",
				slug: "mabel",
				desc: "Highly resilient event ticketing system, designed to withstand spikes of demand at release time",
				description: "bar the second",
			},
			{
				name: "Jambox",
				slug: "jambox",
				desc: "Hackathon project (2nd place) trying to take the pain out of collaborative party playlists",
				description: "foo bar the first",
			},
			{
				name: "Aperio",
				slug: "aperio",
				desc: "(Winning) hackathon project aiming to support the community involved with academic peer-reviews",
				description: "foo bar the first",
			},
			{
				name: "Nev Runner",
				slug: "nev",
				desc: "My first ever coding project: a game-playing bot which achieved high-scores that landed me on TV aged 11",
				description: "bar the second",
			}
		]
		return (
			<div style={{
				// required since nameplate has height 50%
				position: "relative",
				top: "35%",
				margin: "auto",
				maxWidth: 1024,
				marginBottom: 100
			}}>
			 	{
					pieces.map( p =>
						<PortfolioItem key={p.slug} item={p} colors={this.props.colors} />
					)
				}
			</div>
		);
	}
}
export default Portfolio;
