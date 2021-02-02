const Image = require('../models/image');
const { validationResult } = require('express-validator');

const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const uploadImg = multer({ storage: storage }).single('image');

const newImage = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		let image = await Image.findOne({ name: req.body.name });

		const newImage = {
			name: req.body.name,
			image: req.file.path,
		};
		if (image === null) {
			image = new Image(newImage);
			await image.save();
			res.json(`New image saved: ${newImage.name}`);
		} else {
			res.json('Image already exists');
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).send(error.message);
	}
};

module.exports = { newImage, uploadImg };
