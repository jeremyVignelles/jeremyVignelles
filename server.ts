/**
 * The main server file
 */
///<reference path='DefinitelyTyped/express/express.d.ts' />
///<reference path='i18n/i18n' />

import express = require("express");
import i18nModule = require("./i18n/i18n");
import svgRouter = require("./svgRouter");
import router = require("./router");

var i18n = new i18nModule.i18n();
var app = express();

app.use('/stylesheet', express.static(__dirname + "/stylesheet/output"));
app.use('/script', express.static(__dirname + "/script/output"));
app.use(express.static(__dirname + "/static"));

app.engine('jade', require("jade").__express);

// Translation
app.use(i18n.middleware);

app.use('/svg', svgRouter.createRouter());

app.use('/en', router.createRouter());
app.use('/', router.createRouter());

// Azure sets process.env.port so that we know on which port we need to listen. Falls back to 80 for local testing
var port = process.env.port || 80;

app.listen(port);

console.log("Started on port " + port);