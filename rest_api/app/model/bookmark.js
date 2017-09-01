// Load required packages
var mongoose = require('mongoose');

// Define bookmark schema
var BookmarkSchema = new mongoose.Schema({
	url: { type: String, required: true },
	owner: { type: String, required: true },
	updated: { type: Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('Bookmark', BookmarkSchema);