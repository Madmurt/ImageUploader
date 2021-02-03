const express = require('express');
const {
	newImage,
	uploadImg,
	getImage,
} = require('../controllers/imageController');
const router = express.Router();

router.post('/', uploadImg, newImage);

router.get('/:filename', getImage);

module.exports = router;
