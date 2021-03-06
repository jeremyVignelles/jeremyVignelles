/**
 * The module that exposes functions to manipulate the data
 */
///<reference path='../DefinitelyTyped/express/express.d.ts' />
///<reference path='../i18n/i18nInterfaces.d.ts' />
///<reference path='./sourceDataInterfaces.d.ts' />
///<reference path='./generatedDataInterfaces.d.ts' />

import express = require('express');
import path = require('path');
import jsonLoader = require('../tools/jsonLoader');
import util = require('util');

export var idRegex = /^([a-z0-9-]+)\/([a-z0-9-]+)$/i;

class DataManager {
    private database : IGeneratedDatabase;

    /**
     * Compiles the data into the database object
     */
    public build() : void {
        var relationships = jsonLoader.loadSync<ISourceRelationshipData>(path.join(__dirname, "relationships.json"));
        var tags = jsonLoader.loadAllJsonSync<ISourceTagData>(path.join(__dirname, "tags"));

        this.database = {
            aboutMe: jsonLoader.loadSync<IAboutMeData>(path.join(__dirname, "aboutMe.json")),
            jobs: {},
            projects: {},
            qualifications: {},
            skills: {},
            tags: {},

            /**
             * The object where we can find the association "translated URL" => "item identifier"
             * for example ["fr-FR"]["competences"]["javascript"] will have a value of "skills/javascript"
             */
            url: {
                "fr-FR":{},
                "en-US":{}
            }
        };

        // Adds explicit tags
        for(var i = 0; i < tags.length; i++) {
            var tag = DataManager.fillRelationship(<IGeneratedTagData>tags[i]);
            this.database.tags[tag.identifier] = tag;
            this.registerUrl("tags/" + tag.identifier, tag.url);
        }

        this.loadItemCategory("jobs", relationships);
        this.loadItemCategory("projects", relationships);
        this.loadItemCategory("qualifications", relationships);
        this.loadItemCategory("skills", relationships);

        console.log(util.inspect(this.database, false, 10));
    }

    /**
     * Finds a data item in the database from an id
     * @param id
     */
    public findById<T>(id : string) : T {
        if(!idRegex.test(id)) {
            return null;
        }

        var matches = idRegex.exec(id);
        if(['jobs', 'projects', 'qualifications', 'skills', 'tags'].indexOf(matches[1]) === -1) {
            return null;
        }

        return <T>this.database[matches[1]][matches[2]] || null;
    }

    /**
     * Gets the identifier corresponding to this URL
     * @param locale The current locale
     * @param category The requested category
     * @param identifier The item identifier
     * @returns {string} The id (or null if not found) which looks like 'skills/c-sharp'
     */
    public getIdFromURL(locale: string, category: string, identifier: string) : string {
        var categoryArray = this.database.url[locale];
        if(!categoryArray) {
            return null;
        }

        var identifierArray = categoryArray[category];
        if(!identifierArray) {
            return null;
        }

        var id = identifierArray[identifier];

        return id || null;
    }

    /**
     * Gets data about me
     */
    public getDataAboutMe() : IAboutMeData {
        return this.database.aboutMe;
    }

    /**
     * Gets the jobs
     * @returns {IGeneratedJobData[]}
     */
    public getJobsList() : IGeneratedJobData[] {
        var jobs = DataManager.makeListFromDataDictionary(this.database.jobs);
        jobs.sort(function(a:IGeneratedJobData, b:IGeneratedJobData) {
            return b.order - a.order;
        });
        return jobs;
    }

    /**
     * Gets the list of the projects
     * @returns {IGeneratedProjectData[]}
     */
    public getProjectsList() : IGeneratedProjectData[] {
        // gets a copy of the array in order to sort items
        var projects = DataManager.makeListFromDataDictionary(this.database.projects);
        projects.sort(function(a:IGeneratedProjectData, b: IGeneratedProjectData) {
            return b.priority - a.priority;
        });

        return projects;
    }

    /**
     * Gets the list of the qualifications
     * @returns {IGeneratedQualificationData[]}
     */
    public getQualificationsList() : IGeneratedQualificationData[] {
        var qualification = DataManager.makeListFromDataDictionary(this.database.qualifications);
        qualification.sort(function(a:IGeneratedQualificationData, b: IGeneratedQualificationData) {
            return b.order - a.order;
        });

        return qualification;
    }

    /**
     * Gets the list of skills, sorted in level order decreasing
     * @returns {IGeneratedSkillData[]}
     */
    public getSkillsList() : IGeneratedSkillData[] {
        var skills = DataManager.makeListFromDataDictionary(this.database.skills);
        skills.sort(function(a:IGeneratedSkillData, b: IGeneratedSkillData) {
            return b.level - a.level;
        });

        return skills;
    }

    /**
     * Gets the list of tags, sorted by popularity order decreasing
     * @returns {IGeneratedTagData[]}
     */
    public getTagsList() : IGeneratedTagData[] {
        var tags = DataManager.makeListFromDataDictionary(this.database.tags);
        tags.sort(function(a:IGeneratedTagData, b: IGeneratedTagData) {
            return (b.jobs.length + b.projects.length + b.qualifications.length + b.skills.length) - (a.jobs.length + a.projects.length + a.qualifications.length + a.skills.length);
        });

        return tags;
    }

    /**
     * Gets a list of values in a data dictionary
     * @param dataDictionary the data dictionary
     * @returns {T[]} The values
     */
    private static makeListFromDataDictionary<T>(dataDictionary: { [index:string] : T; }) : T[] {
        return Object.getOwnPropertyNames(dataDictionary).map(function(name : string) : T {
            return <T>dataDictionary[name];
        });
    }

    /**
     * Loads entirely a category of items from the data/ subfolders.
     * @param category the item category
     * @param relations The relations described in relationships.json
     */
    private loadItemCategory(category: string, relations : ISourceRelationshipData) {
        var items = jsonLoader.loadAllJsonSync<IGeneratedDataItem>(path.join(__dirname, category));
        for(var i = 0; i < items.length; i++) {
            var currentItem = DataManager.fillRelationship(items[i]);
            for(var j = 0; j < currentItem.tags.length; j++) {
                var tag = this.findById<IGeneratedTagData>("tags/" + currentItem.tags[j]);

                if(!tag) {
                    tag = DataManager.createTag(currentItem.tags[j]);
                    this.registerUrl("tags/" + tag.identifier, tag.url);
                    this.database.tags[tag.identifier] = tag;
                }

                tag[category].push(category + "/" + currentItem.identifier);
            }

            this.registerUrl(category + "/" + currentItem.identifier, currentItem.url);
            this.database[category][currentItem.identifier] = currentItem;

            this.addRelationships(category + "/" + currentItem.identifier, relations);
        }
    }

    /**
     * Registers a URL in the url map
     * @param identifier the item identifier URL
     * @param url the translated URL
     */
    private registerUrl(identifier : string, url : ITranslatableString) : void {
        var matches = idRegex.exec(url["en-US"]);
        var categoryUrl = this.database.url["en-US"][matches[1]];
        if(!categoryUrl) {
            this.database.url["en-US"][matches[1]] = {};
            categoryUrl = this.database.url["en-US"][matches[1]];
        }
        categoryUrl[matches[2]] = identifier;

        matches = idRegex.exec(url["fr-FR"]);
        categoryUrl = this.database.url["fr-FR"][matches[1]];
        if(!categoryUrl) {
            this.database.url["fr-FR"][matches[1]] = {};
            categoryUrl = this.database.url["fr-FR"][matches[1]];
        }
        categoryUrl[matches[2]] = identifier;
    }

    /**
     * Adds the relationships between this element and the other elements (if they exist).
     * If it doesn't exist, this method will be later called with the other argument, filling this one
     * @param itemUrlIdentifier The object unique URL identifier
     * @param relations The relations described in relationships.json
     */
    private addRelationships(itemUrlIdentifier : string, relations : ISourceRelationshipData) : void {
        var self = this;
        var currentItem = this.findById<IItemRelationship>(itemUrlIdentifier);
        if(currentItem === null) {
            throw new Error('item not found with identifier ' + itemUrlIdentifier);
        }

        var currentItemCategory: string = idRegex.exec(itemUrlIdentifier)[1];

        var associatedItems: string[] = [];
        relations.relations.forEach(function(item) {
            if(item[0] === itemUrlIdentifier) {
                associatedItems.push(item[1]);
            } else if(item[1] === itemUrlIdentifier) {
                associatedItems.push(item[0]);
            }
        });

        associatedItems.forEach(function(associatedItemId) {
            var associatedItem = self.findById<IItemRelationship>(associatedItemId);
            if(associatedItem === null) {
                return;
            }

            var associatedItemCategory : string = idRegex.exec(associatedItemId)[1];

            currentItem[associatedItemCategory].push(associatedItemId);
            associatedItem[currentItemCategory].push(itemUrlIdentifier);
        });
    }

    /**
     * Fills a generated object with the default relationships
     * @param generatedObject The object that must be filled with the default relationship
     */
    private static fillRelationship<TGenerated extends IItemRelationship>(generatedObject : TGenerated) : TGenerated {
        (<IItemRelationship>generatedObject).jobs = [];
        (<IItemRelationship>generatedObject).projects = [];
        (<IItemRelationship>generatedObject).qualifications = [];
        (<IItemRelationship>generatedObject).skills = [];

        return generatedObject;
    }

    /**
     * Creates an implicit tag
     * @param id the tag id to create
     * @returns {IGeneratedTagData} The generated tag
     */
    private static createTag(id : string) : IGeneratedTagData {
        return this.fillRelationship(<IGeneratedTagData>{
            "identifier": id,
            "name": {
                "en-US": id,
                "fr-FR": id
            },
            "description": {
                "en-US": <string>null,
                "fr-FR": <string>null
            },
            "url": {
                "en-US": "tags/" + id,
                "fr-FR": "tags/" + id
            }
        })
    }
}

export var instance = new DataManager();
export var middleware = (req : express.Request, res : express.Response, next : Function) => {
    res.locals.dm = instance;
    next();
};