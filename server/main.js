// Load the SDK and UUID
var fs = require('fs');
var path = require('path');
var http = require('http');
var express = require('express');
var apiRoutes = require('./routes/index');

var app = express();
var router = express.Router();
var port = 3001;

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use('/api/v1/', apiRoutes);


http.createServer(app).listen(port, function() {
    console.log('server running on ' + port);
});