const Image = require('../models/image');
const aws = require('aws-sdk');
const fs = require('fs');
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

// const newImage = async (req, res, next) => {
// 	const errors = validationResult(req);
// 	if (!errors.isEmpty()) {
// 		return res.status(400).json({ errors: errors.array() });
// 	}
// 	try {
// 		let image = await Image.findOne({ name: req.body.name });

// 		const newImage = {
// 			name: req.body.name,
// 			image: req.file.path,
// 		};
// 		if (image === null) {
// 			image = new Image(newImage);
// 			await image.save();
// 			res.json(`New image saved: ${newImage.name}`);
// 		} else {
// 			res.json('Image already exists');
// 		}
// 	} catch (error) {
// 		console.error(error.message);
// 		res.status(500).send(error.message);
// 	}
// };

const newImage = (req, res) => {
	aws.config.setPromisesDependency();
	aws.config.update({
		accessKeyId: process.env.ACCESSKEYID,
		secretAccessKey: process.env.SECRETACCESSKEY,
		region: process.env.REGION,
	});

	const s3 = new aws.S3();
	var params = {
		ACL: 'public-read',
		Bucket: 'mmcc-imagestorage-bucket',
		Body: fs.createReadStream(req.file.path),
		Key: `image/${req.file.originalname}`,
	};

	s3.upload(params, (err, data) => {
		if (err) {
			console.log(
				'Error occured while trying to upload to S3 bucket',
				err
			);
		}
		if (data) {
			fs.unlinkSync(req.file.path); // Empty temp folder
			const locationUrl = data.Location;
			let newImage = new Image({ ...req.body, image: locationUrl });
			newImage
				.save()
				.then((image) => {
					res.json({ message: 'Image uploaded successfully', image });
				})
				.catch((err) => {
					console.log('Error occured while trying to save to DB');
				});
		}
	});
};

const getImage = async (res, req) => {
	aws.config.setPromisesDependency();
	aws.config.update({
		accessKeyId: process.env.ACCESSKEYID,
		secretAccessKey: process.env.SECRETACCESSKEY,
		region: process.env.REGION,
	});
	console.log(req);
	var params = await {
		Bucket: 'mmcc-imagestorage-bucket',
		Key: `image/${req.params.filename}`,
	};

	const s3 = new aws.S3();
	await s3.getObject(params, (error, data) => {
		if (error != null) {
			console.log(
				'Error occured while trying get image from DB',
				error.message
			);
		} else {
			fs.writeFile('./uploads/Test.png', data.Body, function (err, data) {
				console.log('Image Downloaded succesfully');
			});
		}
	});
};

module.exports = { newImage, uploadImg, getImage };
