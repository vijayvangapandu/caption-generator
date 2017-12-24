var pretiates = [
    'pretacate number one',
    'pretacate number two',
    'pretacate number three',
];

var subjects = [
    'subject one is a',
    'subject two is a',
    'subject three is a'
];

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getPreticate() {
    return pretiates[random(0,3)];
}

function getSubject(label) {
    return `${subjects[random(0,3)]} ${label}`;
}

module.exports = (req, res, next, label) => {
    return [
        {
            id: 0,
            text: `${getPreticate()} ${getSubject(label)}`
        },
        {
            id: 1,
            text: `${getPreticate()} ${getSubject(label)}`
        },
        {
            id: 2,
            text: `${getPreticate()} ${getSubject(label)}`
        }
    ]
}
