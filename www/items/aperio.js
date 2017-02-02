module.exports =
{
	"name": "Aperio",
	"slug": "aperio",
	"language": "javascript",
	"img": "/img/screenshots/aperio.png",
	"desc": "(Winning) hackathon project aiming to support the community involved with academic peer-reviews",
	"description": `
<p>
	Aperio was my entry into a hackathon themed around "making the world a better place." I entered the competition
	without a team or idea, and picked up both along the way (I mention this to show off my great friend-making skills!)
	The eventual product was a platform for collaborative publishing of academic work. What we wanted to do was
	allow researchers to share their work with the world without needing to go through the difficult publishing companies.
</p>
<p>
	24 hours later, we had built a proof-of-concept demonstrating this idea, including social authentication, and the ability to
	upload documents, comment on specific parts of them and make suggestions for improvements or modifications. I pitched our
	project to a panel of judges, who were sufficiently impressed to award us first place.
</p>
`,
"codeLanguage": "javascript",
	"code": `
var getMySQLConn = module.parent.exports.getMySQLConn;

module.exports = {

	query: function(objectType, queryObj, callback) {
		var connection = getMySQLConn();
		objectType = connection.escapeId(objectType);

		var condition = "";
		var conjunction = " WHERE ";
		var joinObj = null;
		if (queryObj.join && queryObj.join.length > 0)
			joinObj = JSON.parse(queryObj.join);

		delete queryObj.join;
		for (var key in queryObj) {
			if (queryObj.hasOwnProperty(key)) {
				condition += conjunction + connection.escapeId(key) + "=" + connection.escape(queryObj[key]);
				conjunction = " AND ";
			}
		}
		var joinCondition = "";
		if (joinObj !== null) {
			joinCondition = " JOIN " + connection.escapeId(joinObj.with) +
				" ON " + connection.escapeId(joinObj.onl) +
				"=" + connection.escapeId(joinObj.onr);
		}

		console.log('SELECT * FROM ' + objectType + joinCondition + ' ' + condition + ' LIMIT 10');
		connection.query(
			'SELECT * FROM ' + objectType + joinCondition + ' ' + condition + ' LIMIT 10',
			function(err, rows) {
				if (err) {
					callback(null);
				}
				callback(rows);
			});
	},

	dosql: function(sql, params, callback) {
		var connection = getMySQLConn();
		connection.query(
			sql, params,
			function(err, rows) {
				if (err) {
					callback(null);
				}
				callback(rows);
			});
	},

	post: function(objectType, postObj, callback) {
		var connection = getMySQLConn();
		objectType = connection.escapeId(objectType);

		var keys = "";
		var values = "";
		var spacer = "";

		for (var key in postObj) {
			if (postObj.hasOwnProperty(key)) {
				keys += spacer + connection.escapeId(key);
				values += spacer + connection.escape(postObj[key]);
				spacer = ", ";
			}
		}

		var q = "INSERT INTO " + objectType + " (" + keys + ") VALUES (" + values + ")";
		console.log(q);
		connection.query(q, function(err, result) {
			if (err) {
				callback(null);
			} else {
				callback(result);
			}
		});
	},

};`,
	"codeDescription": `
In contrast to some of the other code samples I have included on this site, I am not particularly proud of this code.
I have included it as a demonstration of my ability to design simple time-saving abstractions when the situation requires it.
Hackathons are severely time-limited events, with the direction of movement constantly changing.
To cope with this, I wrote a quick abstraction over SQL, to avoid us needing to constantly create new API endpoints. I am however
very aware that this code has security vulnerabilities (although connection.query does internally escape the SQL created to minimise
some of the risk of SQL injection).
`
}
