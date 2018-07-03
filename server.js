var csv = require('csv-parser')
var fs = require('fs')

var express = require('express')
var app = express();
var bodyParser = require("body-parser");
var locations = [];
var rates = [];
var matchcrit = [];

var init = () => {
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

};

init();

app.use(bodyParser.json());
app.listen(process.env.PORT || 4500);
console.log("App started");
app.use(express.static(__dirname + '/dist'));
var distDir = __dirname + "/dist/kuebix-app";
app.use(express.static(distDir));

app.get('', (req, res) => {
    res.sendFile(__dirname + '/dist/kuebix-app/index.html');
});



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', 'https://kuebixratematch.herokuapp.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/api/v1/locations', (req, res) => {
    return res.json(locations);
});
app.get('/api/v1/rates', (req, res) => {
    return res.json(rates);
});
app.get('/api/v1/matchcrit', (req, res) => {
    return res.json(matchcrit);
});

app.get('*', (req, res) => {
    res.redirect('/');
});
