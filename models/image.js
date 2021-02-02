const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
	name: { type: String },
	image: { type: String },
});

module.exports = mongoose.model('image', ImageSchema);
