/**
* The main server file
*/
///<reference path='DefinitelyTyped/express/express.d.ts' />
///<reference path='i18n/i18n' />
var express = require("express");
var i18nModule = require("./i18n/i18n");

var i18n = new i18nModule.i18n();
var app = express();

app.use('/stylesheet', express.static(__dirname + "/stylesheet/output"));
app.use('/script', express.static(__dirname + "/script/output"));
app.use(express.static(__dirname + "/static"));

app.engine('jade', require("jade").__express);

// Translation
app.use(i18n.middleware);

app.get('/svg/logo.svg', function (req, res) {
    var geo = require('./tools/geometryTools');
    res.locals.geometryTools = geo;

    var imageSize = 128;
    var imageHalfSize = imageSize / 2;
    var radius = 60;
    var margin = imageHalfSize - radius;
    var apothem = (3 * radius) / (2 * Math.sqrt(3));

    res.locals.parameters = {
        thickness: 30,
        imageSize: imageSize,
        radius: radius,
        apothem: apothem
    };

    // The lines of the hexagon, starting from the top corner and walking through the edges clockwise
    res.locals.parameters.hexagonLines = [
        new geo.Line(new geo.Point(imageHalfSize, margin), Math.PI / 6),
        new geo.Line(new geo.Point(imageHalfSize + apothem, 0), Math.PI / 2),
        new geo.Line(new geo.Point(imageHalfSize, imageHalfSize + radius), 5 * Math.PI / 6),
        new geo.Line(new geo.Point(imageHalfSize, imageHalfSize + radius), Math.PI / 6),
        new geo.Line(new geo.Point(imageHalfSize - apothem, 0), Math.PI / 2),
        new geo.Line(new geo.Point(imageHalfSize, margin), 5 * Math.PI / 6)
    ];

    res.locals.parameters.boundsLines = [
        new geo.Line(new geo.Point(0, 0), 0),
        new geo.Line(new geo.Point(imageSize, imageSize), Math.PI / 2),
        new geo.Line(new geo.Point(imageSize, imageSize), 0),
        new geo.Line(new geo.Point(0, 0), Math.PI / 2)
    ];

    res.contentType("image/svg+xml");
    res.render('svg/logo.jade');
});

app.get('/', function (req, res) {
    res.render('index.jade');
});

app.get('/en', function (req, res) {
    res.render('index.jade');
});

app.use(function (req, res) {
    res.status(404);
    res.render('404.jade');
});

// Azure sets process.env.port so that we know on which port we need to listen. Falls back to 80 for local testing
var port = process.env.port || 80;

app.listen(port);

console.log("Started on port " + port);
//# sourceMappingURL=server.js.map
