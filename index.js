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

app.listen(80);

console.log("Started on port 80");
//# sourceMappingURL=index.js.map
