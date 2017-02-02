var express = require('express');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var app = express();

var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
	hot: true,
	filename: 'bundle.js',
	publicPath: '/',
	stats: {
		colors: true,
	},
	historyApiFallback: true,
}));

app.use(webpackHotMiddleware(compiler, {
	log: console.log,
	path: '/__webpack_hmr',
	heartbeat: 10 * 1000,
}));

app.use(express.static(__dirname + '/www'));

app.use("/api/:slug?", function (req, res, next) {
	if (!req.params.slug) {
		const fs = require('fs');
		files = fs.readdirSync('./www/items/');
		return res.json({items:
		files.map(f => {
			const result = require('./www/items/' + f);
			delete require.cache[require.resolve('./www/items/' + f)]
			return result;
		})})
	}

	try {
		res.json(require('./www/items/' + req.params.slug + '.js'))
		delete require.cache[require.resolve('./www/items/' + req.params.slug + '.js')]
	} catch (e) {
		return res.status(500).json({});
	}
} );

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
