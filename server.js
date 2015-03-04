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
