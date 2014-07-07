/***************
 * Server Setup
 ***************/

	var express = require('express'),
		path    = require('path'),
		http    = require('http'),
		app     = express();

	app.engine('html', require('ejs').renderFile);

 /***************
 * Configuration
 ****************/

 	app.set('port', 3000);
 	app.set('views', __dirname + '/views');
 	app.set('view engine', 'html');

 	app.use(express.static(__dirname + '/'));

 /*****************
 * Routes - Define
 ******************/

 	var root     = express.Router();

 	// index page route (http://localhost:3000)
 	root.get('/', function(req, res) {
 		res.render('/index');
 	});

	// route middleware that will happen on every request
	root.use(function(req, res, next) {
		console.log(req.method, req.url);
		next();	
	});

 /*****************
 * Routes - Apply
 ******************/

 	// apply the routes to our application
 	app.use('/', root);

	app.use(function(err, req, res, next) {
		console.error('Error dump: '+err.stack);
		res.send(500, err.stack);
	});

 /**************
 * Start Server
 ***************/

	http.createServer(app).listen(app.get('port'), function () {
	  console.log('Server listening on port ' + app.get('port'));
	});