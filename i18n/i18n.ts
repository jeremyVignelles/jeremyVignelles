/**
 * The translation module
 */

///<reference path='../DefinitelyTyped/express/express.d.ts' />
///<reference path='../DefinitelyTyped/node/node.d.ts' />
///<reference path='i18nInterfaces.d.ts' />

import express = require('express');
import fs = require('fs');
import url = require('url');
import path = require('path');
import jsonLoader = require('../tools/jsonLoader');

/**
 * The translation class
 */
class i18n {
    private translations : ITranslatableContent<any> = {
        "en-US" : {},
        "fr-FR" : {}
    };

    /**
     * Constructs the i18n class
     */
    public constructor() {
        this.translations["en-US"] = jsonLoader.loadSync<any>(path.join(__dirname, "en-US", "translation.json"));
        this.translations["fr-FR"] = jsonLoader.loadSync<any>(path.join(__dirname, "fr-FR", "translation.json"));
    }

    /**
     * An express middleware that fills res.locals.locale and res.locals._ for using in jade
     * @param req The request.
     * @param res The response.
     * @param next The next function to be executed.
     */
    public middleware = (req : express.Request, res : express.Response, next : Function) => {
        res.locals.locale = this.getLocale(req);
        res.locals.lang = res.locals.locale.substring(0,2);

        var self = this;
        res.locals._ = function(key : string) : string {
            return self.translate(key, res.locals.locale);
        };

        var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        var parsedUrl = url.parse(fullUrl);

        if(res.locals.locale === 'fr-FR') {
            parsedUrl.pathname = "/en" + parsedUrl.pathname;
            res.locals.alternatives = {
                'en': url.format(parsedUrl)
            };
        } else {
            parsedUrl.pathname = parsedUrl.pathname.replace("/en/", "/");
            res.locals.alternatives = {
                'fr': url.format(parsedUrl)
            };
        }

        next();
    };

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
        var currentObject : any = this.translations[locale];

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
        if(req.path.indexOf("/en") === 0) {
            return "en-US";
        } else {
            return "fr-FR";
        }
    }
}

var instance = new i18n();

export var middleware = instance.middleware;