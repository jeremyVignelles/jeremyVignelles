///<reference path='../DefinitelyTyped/node/node.d.ts' />
import fs = require('fs');
import path = require('path');

var jsonFilesRegex = /\.json$/i;

/**
 * Loads a json object
 * @param filePath The file to load
 * @param callback The callback that will be called at the end of the operation
 */
export function load<T>(filePath : string, callback : (err : Error, result : T) => void) {
    fs.readFile(filePath, {encoding: "UTF-8"}, function(err, result) {
        if(err) {
            callback(err, null);
        } else {
            try {
                var objectResult = <T>JSON.parse(result);
                callback(null, objectResult);
            } catch (e) {
                callback(e, null);
            }
        }
    });
}

/**
 * Loads a json object synchronously
 * @param filePath The file to load
 */
export function loadSync<T>(filePath : string) : T {
    var result : string = fs.readFileSync(filePath, {encoding: "UTF-8"});
    return <T>JSON.parse(result);
}

/**
 * Loads every json file in that directory
 * @param directory the directory to read
 */
export function loadAllJsonSync<T>(directory : string) : T[] {
    var files : string[] = fs.readdirSync(directory);
    var results : T[] = [];
    for(var i = 0;i < files.length; i++) {
        if(!jsonFilesRegex.test(files[i])) {
            continue;
        }

        results.push(loadSync<T>(path.join(directory, files[i])));
    }

    return results;
}