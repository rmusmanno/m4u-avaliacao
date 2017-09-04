// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Bookmark = require('./bookmark');

// Define user schema
var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	admin: {
		type: Boolean,
		default: false
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

UserSchema.pre('save', function(callback) {
	var user = this;

	// Break out if the password hasn't changed
	if (!user.isModified('password')) return callback();

	// Password changed so we need to hash it
	bcrypt.genSalt(5, function(err, salt) {
		if (err) return callback(err);

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return callback(err);
			user.password = hash;
			callback();
		});
	});
});

UserSchema.pre('remove', function(next) {
	var user = this;

	Bookmark.remove({
		owner: user._id
	}, function(err, obj) {
		next();
	});
});

UserSchema.methods.verifyPassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);