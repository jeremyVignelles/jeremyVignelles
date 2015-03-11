/**
 * The routing module
 */

///<reference path='DefinitelyTyped/express/express.d.ts' />

import express = require('express');

/**
 * The routing module
 */
export function createRouter() : express.Router {
    var router = express.Router();

    router.get('/', function(req : express.Request, res : express.Response) {
        res.render('index.jade');
    });

    router.use(function(req : express.Request, res : express.Response) {
        res.status(404);
        res.render('404.jade');
    });

    return router;
}