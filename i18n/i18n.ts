/**
 * Created by cube45 on 01/03/15.
 */

///<reference path='../DefinitelyTyped/express/express.d.ts' />
///<reference path='../DefinitelyTyped/node/node.d.ts' />

import express = require('express');
import fs = require('fs');
import path = require('path');

/**
 * The translation class
 */
export class i18n {
    private translations = {
        "en-US" : {},
        "fr-FR" : {}
    };

    /**
     * Constructs the i18n class
     */
    public constructor() {
        this.translations["en-US"] = JSON.parse(fs.readFileSync(path.join(__dirname, "en-US", "translation.json"), {encoding : "UTF-8" }));
        this.translations["fr-FR"] = JSON.parse(fs.readFileSync(path.join(__dirname, "fr-FR", "translation.json"), {encoding : "UTF-8" }));
    }

    /**
     * An express middleware that fills res.locals.locale and res.locals._ for using in jade
     * @param req The request.
     * @param res The response.
     * @param next The next function to be executed.
     */
    public middleware = (req : express.Request, res : express.Response, next : Function) => {
        res.locals.locale = this.getLocale(req);

        var self = this;
        res.locals._ = function(key : string) : string {
            return self.translate(key, res.locals.locale);
        };
        next();
    }

    /**
     * Translate the given key by using the given locale
     * @param key The key to translate
     * @param locale The locale to use for translation
     * @returns {string} The translated string
     */
    private translate(key : string, locale : string) : string {
        if(!this.translations.hasOwnProperty(locale)) {
            throw new Error("Language not found!");
        }

        var path = key.split('.');
        var currentObject = this.translations[locale];

        for(var i=0;i<path.length;i++) {
            if(!currentObject.hasOwnProperty(path[i])) {
                throw new Error("Translation not found for key " + key);
            }

            currentObject = currentObject[path[i]];
        }

        return <string>currentObject;
    }

    /**
     * Gets the locale of the page, depending on the path requested
     * @param req The user's request
     * @returns {string} The locale used
     */
    private getLocale(req : express.Request) : string {
        if(req.path.indexOf("/en") == 0) {
            return "en-US";
        } else {
            return "fr-FR";
        }
    }
}

