var data = require('../data/captions.json');

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getCaption(label) {
    var { caption } = data[randomInt(0, data.length)];
    if (caption.indexOf('[') != -1) {
        return caption.replace(/\[(.+?)\]/g, label.toLowerCase());
    }
    return caption;
}


module.exports = getCaption;