/**
 * The routing module
 */

///<reference path='DefinitelyTyped/express/express.d.ts' />
///<reference path='data/dataManager.ts' />
///<reference path='data/generatedDataInterfaces.d.ts' />

import express = require('express');
import url = require('url');
import dm = require('./data/dataManager');

/**
 * The routing module
 */
export function createRouter() : express.Router {
    var router = express.Router();

    router.get('/', function(req : express.Request, res : express.Response) {
        var host = req.protocol + "://" + req.get("host");
        res.locals.alternatives = {
            'en' : host + '/en/',
            'fr' : host + '/'
        };
        res.render('index.jade');
    });

    router.get('/:category/:id', function(req : express.Request, res : express.Response, next : Function) {
        var id = dm.instance.getIdFromURL(res.locals.locale, req.params.category, req.params.id);

        if(!id) {
            next();
            return;
        }

        var item = res.locals.dm.findById(id);
        if(!item) {
            next();
            return;
        }

        var host = req.protocol + "://" + req.get("host");
        res.locals.alternatives = {
            'en' : host + res.locals.getURL(item, "en-US"),
            'fr' : host + res.locals.getURL(item, "fr-FR")
        };

        res.locals.currentItem = item;
        res.locals.currentItemType = id.match(dm.idRegex)[1];

        res.render('dataItem.jade');
    });

    router.use(function(req : express.Request, res : express.Response) {
        res.locals.alternatives = null;

        res.status(404);
        res.render('404.jade');
    });

    return router;
}