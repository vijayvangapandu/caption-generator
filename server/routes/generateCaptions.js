var express = require('express');
var router = express.Router();
var getCaption = require('../middleware/getCaption');

router.post('/generate-captions', function(req, res) {
    res.status(200).json([
        {
            id: 0,
            text: getCaption(req.body.label)
        },
        {
            id: 1,
            text: getCaption(req.body.label)
        },
        {
            id: 2,
            text: getCaption(req.body.label)
        },
    ]);
});

module.exports = router;