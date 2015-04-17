/**
 * The routing module for the SVG pictures
 */

///<reference path='DefinitelyTyped/express/express.d.ts' />

import express = require('express');
import fs = require('fs');

/**
 * The routing module
 */
export function createRouter() : express.Router {
    var router = express.Router();

    router.get('/:logo.svg', function(req : express.Request, res : express.Response, next: Function) {
        var files : string[] = fs.readdirSync("views/svg/");

        for(var i = 0; i < files.length; i++) {
            if(files[i] === req.params.logo + '.jade') {
                res.locals.standalone = true;
                res.contentType("image/svg+xml");
                res.render('svg/' + req.params.logo + '.jade');
                return;
            }
        }

        next();
    });

    router.use(function(req : express.Request, res : express.Response) {
        res.status(404);
        res.render('404.jade');
    });

    return router;
}