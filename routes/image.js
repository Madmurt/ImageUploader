const express = require('express');
const { newImage, uploadImg } = require('../controllers/imageController');
const router = express.Router();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', jsonParser, uploadImg, newImage);

module.exports = router;
