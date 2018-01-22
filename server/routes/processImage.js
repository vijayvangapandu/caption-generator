var express = require('express');
var router = express.Router();
var https = require('https');
var fs = require('fs');

var AWS = require('aws-sdk');
var uuidv1 = require('uuid/v1');
var config = require('../config');
var getCaption = require('../middleware/getCaption');

// Create an S3 client
var s3 = new AWS.S3();
var rekognition = new AWS.Rekognition({
    apiVersion: '2016-06-27',
    accessKeyId: config.AWS.ACCESS_KEY,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
    sslEnabled: true,
    region:'us-west-2',
    httpOptions: {
        agent: new https.Agent({
            secureProtocol: "TLSv1_method",
            ciphers: "ALL"
        })
    }
});

function writeImageFile(name, base64String) {
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

function processImage(req, res) {
    var body = req.body;
    var name = createImageId(body.name);
    writeImageFile(name, body.dataURL)
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
            return {
                labels: data.Labels.map((label) => label.Name),
                captions: [
                    {
                        id: 0,
                        text: getCaption(data.Labels[0].Name)
                    },
                    {
                        id: 1,
                        text: getCaption(data.Labels[1].Name)
                    },
                    {
                        id: 2,
                        text: getCaption(data.Labels[2].Name)
                    },
                ]
            }
        })
        .then((payload) => {
            res.status(200).json(payload);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
}

router.post('/process-image', processImage);




module.exports = router;
