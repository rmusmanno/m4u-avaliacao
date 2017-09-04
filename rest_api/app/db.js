// Database connection - dummy db
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin123@ds119014.mlab.com:19014/nodeapi', {
	useMongoClient: true
});

// Create default admin user
var User = require('./model/user');

// dummy admin user
User.create({
		username: "admin",
		password: "admin123",
		admin: true
	},
	function(err, obj) {
		if (!err)
			console.log("Dummy root user created!");
	});