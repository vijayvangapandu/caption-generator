var express = require('express');
var router = express.Router();
var config = require('../config');
var firebase = require('firebase');
var algoliasearch = require('algoliasearch');

firebase.initializeApp(config.FIREBASE_CONFIG);

var ALGOLIA_INDEX_NAME = 'captions';
console.log(config.ALGOLIA.ID, config.ALGOLIA.API_KEY);
var client = algoliasearch(config.ALGOLIA.ID, config.ALGOLIA.API_KEY);

var database = firebase.database();

firebase.database().ref('captions/').on('child_added', function(data) {
    var caption = Object.assign({objectID: data.key}, data.val());
    console.log(caption);
});

router.post('/save-caption', function(req, res) {
    firebase.database().ref('captions').push({
        tags: ['people', 'sleep', 'night'],
        caption: 'Why can\'t I sleep at what?'
    }).then(() => {
        res.status(200).json({'status':'ok'});
    });
});

module.exports = router;