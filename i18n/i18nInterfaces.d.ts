/**
 * Represents an object that contains a translated string
 */

interface ITranslatableContent<T> {
    "fr-FR": T;
    "en-US": T;
    [idx: string]: T;
}

interface ITranslatableString extends ITranslatableContent<string> {
}