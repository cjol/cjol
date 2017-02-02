module.exports =
{
	"name": "Jambox",
	"slug": "jambox",
	"language": "javascript",
	"img": "/img/screenshots/jambox.png",
	"desc": "Hackathon project (2nd place) trying to take the pain out of collaborative party playlists",
	"description": `
<p>
	Jambox was another hackathon project -- this time built for Paypal's 2014 Battlehack. This is a prestigious global-scale hackathon,
	and we were proud of our second place position -- especially given that the team was only formed on the day, so we had to overcome
	all the usual team-building challenges as well as building a great product.
</p>
<p>
	Jambox aims to make collborative party playlists more manageable. The status quo for this is that someone leaves their laptop running
	Spotify, with people fighting for control over it. We built a mobile solution allowing people to connect their phones to a locally-running Jambox
	server (no internet required!). From there, guests can add their favourite tracks from Spotify, SoundCloud or their own local device. Additionally,
	guests can vote to skip particular tracks, and once a track has been "skipped" often enough, it will be removed from the upcoming queue.
</p>
	`,
	"codeLanguage": "javascript",
	"code": `
// 'use strict';

var sleep = require('sleep');

var express = require('express');
module.exports.express = express;
var app = express();
var http = require('http');

var config = require("./config");
var default_config = {
    port: 80,
    cserver: "http://jambox.tk",
    skip_threshold: 3,
    interface: "wlan0"
};

config.port = config.port || default_config.port;
config.cserver = config.cserver || default_config.cserver;
config.skip_threshold = config.skip_threshold || default_config.skip_threshold;
config.interface = config.interface || default_config.interface;
module.exports.config = config;
if (typeof config.jambox_name === 'undefined')
	throw new Error("config.jambox_name must be set!");
// if (typeof config.host_paypal === 'undefined')
// 	throw new Error("config.host_paypal must be set!");

module.exports.app = app;

var API = require("./api");

// start mopidy server
var exec = require('child_process').exec;
exec('/usr/bin/mopidy', function (error, stdout, stderr) {
  console.log("MOPIDY: server started");
});

// Let Mopidy wake up
sleep.sleep(6);

// select the default interface to provide the address for.
var os=require('os');
var ifaces=os.networkInterfaces();
var address = '';
for (var i = ifaces[config.interface].length - 1; i >= 0; i--) {
  if (ifaces[config.interface][i].family == 'IPv4') {
    address = ifaces[config.interface][i].address;
  }
}


// notify CA that we have a new Jambox over here
var url = config.cserver + "/add/" +
  encodeURIComponent(config.jambox_name) + "/" +
  encodeURIComponent(address);

console.log("Registering server at " + url);
http.get(url, function(res) {
  console.log("Registered server: " + res.statusCode);
});

// setup cleanup code before making a mess
var jukeboxID;
var delServer = function() {
  var url = config.cserver + "/delete/" + jukeboxID;

  http.get(url, function(res) {
    console.log("deregistered server: " + res.statusCode);
    process.exit();
  }).on('error', function(e) {
    console.log("Couldn't delete")
    throw new Error("Could not delete server");
  });
};

process.stdin.resume();
process.on('SIGINT', delServer);
process.on('exit', delServer);
// process.on('uncaughtException', delServer);

// create a new http server for socket.io to bind to
var server = require("http").Server(app);
var io = require("socket.io")(server);

var api = new API({
	webSocketUrl: "ws://localhost:6680/mopidy/ws/",
	callingConvention: "by-position-or-by-name",
}, {
	skipThreshold : config.skip_threshold,
},io);
module.exports.api = api;

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

require("./routes")(app);

// any requested page not routed by the above should result in a 404
app.get('/*', function(req, res) {
    res.send("404 Page not found");
});

// set the default directory for templated pages
app.set("views", __dirname + "/client");


// listen on selected port
server.listen(config.port);
console.log("Jambox running on port " + config.port );
`,
	"codeDescription": `I use express and Node for almost every project, so it would be remiss not to include an example in my portfolio.
	Again, this was a hackathon example, so not necessarily the cleanest implementation. It does a bit of fun stuff with sockets, but
	that's about all the interest going on here!`,
	order: 8
}
