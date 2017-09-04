// Load required packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define bookmark schema
var BookmarkSchema = new mongoose.Schema({
	url: {
		type: String,
		required: true
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

// Export the Mongoose model
module.exports = mongoose.model('Bookmark', BookmarkSchema);