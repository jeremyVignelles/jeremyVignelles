/**
 * Tools used for the dynamic SVG logo creation
 */

import geometryTools = require('./geometryTools');

// The constant values of the hexagon picture

/**
 * The image size in px
 */
export var imageSize = 128;

/**
 * The image's half size
 */
var imageHalfSize = imageSize / 2;

/**
 * The hexagon radius (distance from the center to each corner
 */
var radius = 60;

/**
 * The hexagon's apothem, i.e distance between center and any side
 */
var apothem = (3 * radius) / (2 * Math.sqrt(3));

/**
 * The letter thickness
 */
var thickness = 30;

/**
 * The lines of the hexagon, starting from the top corner and walking through the edges clockwise
 */
var hexagonLines = [
    new geometryTools.Line(new geometryTools.Point(imageHalfSize, imageHalfSize - radius), Math.PI / 6),
    new geometryTools.Line(new geometryTools.Point(imageHalfSize + apothem, 0), Math.PI / 2),
    new geometryTools.Line(new geometryTools.Point(imageHalfSize, imageHalfSize + radius), 5 * Math.PI / 6),
    new geometryTools.Line(new geometryTools.Point(imageHalfSize, imageHalfSize + radius), Math.PI / 6),
    new geometryTools.Line(new geometryTools.Point(imageHalfSize - apothem, 0), Math.PI / 2),
    new geometryTools.Line(new geometryTools.Point(imageHalfSize, imageHalfSize - radius), 5 * Math.PI / 6)
];

/**
 * The sides of the hexagon.
 * This is a list of segments, each is composed of two points
 */
export var hexagonSides : geometryTools.Point[][] = [];

for(var i=0; i<hexagonLines.length;i++) {
    var currentLine = hexagonLines[i];
    hexagonSides.push([
        currentLine.getIntersectionWith(hexagonLines[(i + 1) % 6]),
        currentLine.getIntersectionWith(hexagonLines[(i + 5) % 6])
    ]);
}

var bottomRightCorner = hexagonLines[1].getIntersectionWith(hexagonLines[2]);
var startY = (imageSize / 2) - radius;

export var rectangle = {
    x: bottomRightCorner.x - thickness,
    y: startY,
    width: thickness,
    height: bottomRightCorner.y - startY
};

var parallelLine = hexagonLines[2].translate(-thickness);

export var polygon1 = [
    parallelLine.getIntersectionWith(hexagonLines[1]),
    bottomRightCorner,
    (imageHalfSize + ',' + (imageHalfSize + radius)),
    parallelLine.getIntersectionWith(hexagonLines[3])
];

parallelLine = hexagonLines[3].translate(thickness);

export var polygon2 = [
    parallelLine.getIntersectionWith(hexagonLines[2]),
    imageHalfSize + ',' + (imageHalfSize + radius),
    hexagonLines[3].getIntersectionWith(hexagonLines[4]),
    parallelLine.getIntersectionWith(hexagonLines[4])
];