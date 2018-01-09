// Load the SDK and UUID
var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var config = require('./config.js');

var AWS = require('aws-sdk');
var Sentencer = require('sentencer');
var uuidv1 = require('uuid/v1');
var captions = require('./middleware/captions');
var fetch = require('node-fetch');

var app = express();
var port = 3001;

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Create an S3 client
var s3 = new AWS.S3();
var rekognition = new AWS.Rekognition({
    apiVersion: '2016-06-27',
    accessKeyId: config.ACCESS_KEY,
    secretAccessKey: config.SECRET_ACCESS_KEY,
    sslEnabled: true,
    region:'us-west-2',
    httpOptions: {
        agent: new https.Agent({
            secureProtocol: "TLSv1_method",
            ciphers: "ALL"
        })
    }
});

function processImage(name, base64String) {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, base64String.split(';base64,').pop(), {encoding: 'base64'}, function(error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

function createImageId(name) {
    var type = name.split('.')[1];
    return uuidv1() + '.' + type;
}

app.post('/api/v1/process', function (req, res) {
    var body = req.body;
    var name = createImageId(body.name);
    processImage(name, body.dataURL)
        .then(() => {
            return new Promise((resolve, reject) => {
                fs.readFile('./' + name, function (error, data) {
                    s3.putObject({Bucket: 'cgen-uploads', Key: name, Body: data}, function(error, data) {
                        if (error) {
                            console.log('failed to put object in s3', error);
                            reject();
                        } else {
                            console.log('put object in s3');
                            resolve();
                        }
                    });
                });
            })
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                fs.unlink('./' + name, function(error) {
                    if (error) {
                        reject();
                        console.log('error deleting object');
                    } else {
                        resolve();
                        console.log('object deleted from disk');
                    }
                });
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                var params = {
                    Image: {
                        S3Object: {
                            Bucket: 'cgen-uploads',
                            Name: name
                        }
                    },
                    MaxLabels: 123,
                    MinConfidence: 70
                };
                console.log('label detection started', params);
                rekognition.detectLabels(params, function(error, data) {
                    if (error) {
                        console.log(error, error.stack);
                        console.log('label detection failed', error);
                        reject();
                    } else {
                        console.log('label detection success', data);
                        resolve(data);
                    }
                });
            });
        })
        .then((data) => {
            var labels = data.Labels.map((label) => {
                return label.Name
            });
            return {
                labels: labels,
                captions: captions(labels[0])
            }
        })
        .then((payload) => {
            res.status(200).json(payload);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

app.post('/api/v1/captions', function (req, res) {
        res.status(200).json({
            captions: captions(req.body.label)
        });
    }
);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

http.createServer(app).listen(port, function() {
    console.log('server running on ' + port);
});