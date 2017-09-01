// Application entry point & configuration

var express = require('express');
var app = express();
var router = express.Router();
var db = require('./db');

require('./routes.js')(app, router)

module.exports = app;