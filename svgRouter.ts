/**
 * The routing module for the SVG pictures
 */

///<reference path='DefinitelyTyped/express/express.d.ts' />

import express = require('express');
import geo = require('./tools/geometryTools');

/**
 * The routing module
 */
export function createRouter() : express.Router {
    var router = express.Router();

    router.get('/logo.svg', function(req : express.Request, res : express.Response) {
        res.locals.geometryTools = geo;

        var imageSize = 128;
        var imageHalfSize = imageSize / 2;
        var radius = 60;
        var margin = imageHalfSize - radius;
        var apothem = (3 * radius) / (2 * Math.sqrt(3));

        res.locals.parameters = {
            thickness: 30, // The letter thickness
            imageSize: imageSize, // The size of the SVG
            radius: radius, // The radius of the circumscribed circle
            apothem: apothem // radius of the inscribed circle
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

    router.use(function(req : express.Request, res : express.Response) {
        res.status(404);
        res.render('404.jade');
    });

    return router;
}