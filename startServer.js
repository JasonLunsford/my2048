
/*********************
 * Module dependencies
 *********************/

var express = require('express'),
	morgan  = require('morgan'),
	routes  = require('./routes'),
	http    = require('http'),
	path    = require('path');

var app = module.exports = express();
var env = process.env.NODE_ENV || 'development';

app.engine('html', require('ejs').renderFile);

/***************
 * Configuration
 ***************/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

/********
 * Routes
 ********/

var root 	   = express.Router(),
	partials   = express.Router(),
	everything = express.Router();

// serve index and view partials
root.get('/', routes.index);
partials.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
everything.get('*', routes.index);

app.use('/', root);
app.use('/partials/:name', partials);
app.use('*', everything);

/**************
 * Start Server
 **************/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
