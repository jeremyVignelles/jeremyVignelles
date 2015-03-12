/**
 * The translation module
 */
var fs = require('fs');
var url = require('url');
var path = require('path');
/**
 * The translation class
 */
var i18n = (function () {
    /**
     * Constructs the i18n class
     */
    function i18n() {
        var _this = this;
        this.translations = {
            "en-US": {},
            "fr-FR": {}
        };
        /**
         * An express middleware that fills res.locals.locale and res.locals._ for using in jade
         * @param req The request.
         * @param res The response.
         * @param next The next function to be executed.
         */
        this.middleware = function (req, res, next) {
            res.locals.locale = _this.getLocale(req);
            res.locals.lang = res.locals.locale.substring(0, 2);
            var self = _this;
            res.locals._ = function (key) {
                return self.translate(key, res.locals.locale);
            };
            var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
            var parsedUrl = url.parse(fullUrl);
            if (res.locals.locale == 'fr-FR') {
                parsedUrl.pathname = "/en" + parsedUrl.pathname;
                res.locals.alternatives = {
                    'en': url.format(parsedUrl)
                };
            }
            else {
                parsedUrl.pathname = parsedUrl.pathname.replace("/en/", "/");
                res.locals.alternatives = {
                    'fr': url.format(parsedUrl)
                };
            }
            next();
        };
        this.translations["en-US"] = JSON.parse(fs.readFileSync(path.join(__dirname, "en-US", "translation.json"), { encoding: "UTF-8" }));
        this.translations["fr-FR"] = JSON.parse(fs.readFileSync(path.join(__dirname, "fr-FR", "translation.json"), { encoding: "UTF-8" }));
    }
    /**
     * Translate the given key by using the given locale
     * @param key The key to translate
     * @param locale The locale to use for translation
     * @returns {string} The translated string
     */
    i18n.prototype.translate = function (key, locale) {
        if (!this.translations.hasOwnProperty(locale)) {
            throw new Error("Language not found!");
        }
        var path = key.split('.');
        var currentObject = this.translations[locale];
        for (var i = 0; i < path.length; i++) {
            if (!currentObject.hasOwnProperty(path[i])) {
                throw new Error("Translation not found for key " + key);
            }
            currentObject = currentObject[path[i]];
        }
        return currentObject;
    };
    /**
     * Gets the locale of the page, depending on the path requested
     * @param req The user's request
     * @returns {string} The locale used
     */
    i18n.prototype.getLocale = function (req) {
        if (req.path.indexOf("/en") == 0) {
            return "en-US";
        }
        else {
            return "fr-FR";
        }
    };
    return i18n;
})();
exports.i18n = i18n;
