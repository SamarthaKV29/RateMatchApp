var csv = require('csv-parser')
var fs = require('fs')


var locations = [];
var rates = [];
var matchcrit = [];

init = () => {
    fs.createReadStream('data/locations.csv')
        .pipe(csv())
        .on('data', (data) => {
            locations.push(data);
        })
        .on('end', () => {
            console.log(locations.length);
        })

    fs.createReadStream('data/rates.csv')
        .pipe(csv())
        .on('data', (data) => {
            rates.push(data);
        })
        .on('end', () => {
            console.log(rates.length);
        })
    fs.createReadStream('data/rate_matching_criteria.csv')
        .pipe(csv())
        .on('data', (data) => {
            matchcrit.push(data);
        })
        .on('end', () => {
            console.log(matchcrit.length);
        })

}

init();

var express = require('express')
var app = express();
app.listen(process.env.PORT || 4500);
console.log("App started");

app.get('/api/v1/locations', (req, res) => {
    return res.json(locations);
});
app.get('/api/v1/rates', (req, res) => {
    return res.json(rates);
});
app.get('/api/v1/matchcrit', (req, res) => {
    return res.json(matchcrit);
});

app.use(express.static(__dirname + '/dist'));
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});