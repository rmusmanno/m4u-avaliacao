// Application server - No https forcing. Debug only
var app = require('./app/app');
var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});

module.exports = server;
/*
// Application server - Forcing https, because of basic auth mode
var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express');

var port = 3000;

var options = {
    key: fs.readFileSync('./ssl/ssl-key.pem'),
    cert: fs.readFileSync('./ssl/ssl-cert.pem'),
};

var app = require('./app/app');

var server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});
*/