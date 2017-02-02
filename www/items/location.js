module.exports =
{
	"name": "Location Finder",
	"slug": "location",
	"languages": ["javascript"],
	"img": "/img/screenshots/location.png",
	"desc": "Borne of frustration, a two-hour API mashup helping identify the most cost-effective commute options",
	"description": `
<p>
	I have included this in my portfolio, not as a demonstration of my programming ability, but rather as evidence that
	I can rapidly come up with practical solution to problems.
</p>
<p>
	Here, the problem was that, when house-hunting with three other friends, our choice of location was guided by rumour and hearsay rather
	than by fact and data. To resolve this, I scraped a list of 600 stations in London over the course of an evening, and wrote a script to evaluate each location. Firstly,
	the script connected to the Google Navigation API to determine the minimum, maximum and average commute time for each of us when starting
	from that location. Secondly, it connected to the Zoopla API (with some creative solutions to bypass rate-limiting) to obtain average price
	information for the area surrounding each station.
</p>
<p>
	This allowed us to calculate a proxy for both distance and rent price at each of these locations, thereby directing our search with much more
	confidence than I had had before.
</p>
`,
	"codeLanguage": "html",
	"code": `
const _ = require( 'lodash' );
const request = require( "request" );
const fs = require( 'fs' );
const json2csv = require( 'json2csv' );

const zoopla = require( './zoopla.js' );
const citymapper = require( './citymapper.js' );
const googlemaps = require( './googlemaps.js' );

const allStations = require( './data/stations.json' );
const commuteDestinations = require( './data/destinations.json' )

/*******************
 * Property Search *
 *******************/

// first, collect all data (will be put into JSON files for repeatability)
const subset = allStations;
Promise.all( [
		zoopla( subset, 0.3, 3, 3 ),
		// citymapper API has too harsh rate limits so we'll use Google
		// citymapper( subset, commuteDestinations, { hours: 9, minutes: 0 } ),
		googlemaps( subset, commuteDestinations, { hours: 9, minutes: 0 } ),
	] )

	// then calculate aggregates
	.then( function() {

		// load commute data, then look up price data for each point
		// I'm tolerating blocking I/O for simplicity here BTW!
		const commutes = JSON.parse( fs.readFileSync( "./data/gen/commutes.json" ) );
		const locs = Object.keys( commutes );

		return _( locs )
			// to run things on a subsample, uncomment this line
			// .take(10)
			.map(
				loc => {
					// get the relevant commute times at this point:
					const commute = commutes[ loc ];

					// get the relevant price data for 3-bed places
					const properties =
						_( JSON.parse( fs.readFileSync( \`./data/gen/prices/\${loc}.json\` ) ) )
						.filter( prop => prop.num_bedrooms == 3 )
						.map( prop => ( {
							price: prop.rental_prices,
							url: prop.details_url,
							image_url: prop.thumbnail_url,
							orig: prop.length
						} ) )
						.value();

					try {
						let result = {
							name: loc,

							// calculate time aggregates
							minTime: _( commute )
								.values()
								.map( s => Math.ceil( s / 60 ) )
								.reduce( ( agg, m ) => Math.min( agg, m ) ),

							maxTime: _( commute )
								.values()
								.map( s => Math.ceil( s / 60 ) )
								.reduce( ( agg, m ) => Math.max( agg, m ) ),

							avgTime: _( commute )
								.values()
								.map( s => Math.ceil( s / 60 ) )
								.reduce( ( agg, s ) => agg + s ) /
								( _.values( commute )
									.length ),

							timeChris: commute[ "EF" ] / 60,
							timeMac: commute[ "SOAS" ] / 60,
							timeTom: commute[ "Zopa" ] / 60,
							timeDaisy: commute[ "Mirabaud" ] / 60,

							// calculate price aggregates
							propNum: properties.length,

							minWeek: _( properties )
								.reduce( ( agg, prop ) => Math.min( agg, prop.price.per_week ), 999999999 ),

							avgWeek: _( properties )
								.reduce( ( agg, prop ) => agg + parseInt( prop.price.per_week ), 0 ) / properties.length,

							maxWeek: _( properties )
								.reduce( ( agg, prop ) => Math.max( agg, prop.price.per_week ), 0 ),

							minMonth: _( properties )
								.reduce( ( agg, prop ) => Math.min( agg, prop.price.per_month ), 999999999 ),

							avgMonth: _( properties )
								.reduce( ( agg, prop ) => agg + parseInt( prop.price.per_month ), 0 ) / properties.length,

							maxMonth: _( properties )
								.reduce( ( agg, prop ) => Math.max( agg, prop.price.per_month ), 0 ),


						};

						// calculate a proxy summary for all this
						result.cpm = result.avgWeek / result.avgTime;

						return result;
					} catch ( e ) {
						console.error( e );
					}

				} )
			.filter( r => r.minWeek < 999999999 )
			.value();
	} )
	.then( results => {
		fs.writeFileSync( 'data/gen/aggregate.csv',
			json2csv( { data: results, fields: Object.keys( results[ 0 ] ) } ) );
	} )
`,
	"codeDescription": "A glimpse into my quick \"gets the job done\" style of coding.",
	order: 4
}
