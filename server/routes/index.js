var express = require('express');
var router = express.Router();
var processImage = require('./processImage');
var generateCaptions = require('./generateCaptions');
var storeCaptions = require('./storeCaptions');

router.use('/', processImage, generateCaptions, storeCaptions);

module.exports = router;



