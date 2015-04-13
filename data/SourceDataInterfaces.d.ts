/**
 * The interfaces that represent the source data
 */
///<reference path='../i18n/i18nInterfaces.d.ts' />

/**
 * Defines the common properties of every SourceData
 */
interface ISourceData {
    /**
     * The item's identifier
     */
        identifier: string;

    /**
     * The item's title
     */
        title: ITranslatableString;

    /**
     * The displayed logo URL
     */
        logo: string;

    /**
     * A summary of what it is, in a few words
     */
        summary: ITranslatableString;

    /**
     * A more detailed description about what it was about.
     */
        description: ITranslatableString;

    /**
     * A list of tags
     */
        tags: string[];

    /**
     * The item's page URL
     */
        url: ITranslatableString;

    /**
     * Some achievements related to this item
     */
        achievements: ITranslatableString[];
}

/**
 * Represents the structure of a "professional experience"
 */
interface ISourceJobData extends ISourceData {
    /**
     * The company name
     */
        company: string;

    /**
     * The company website URL
     */
        companyLink: string;

    /**
     * The dates, as a translatable string
     * I didn't select the dateTime format but a string to be able to enter exactly what I want, for example:
     * "November 2013 - June 2014", "2015", ...
     */
        dates: ITranslatableString;

    /**
     * The order of the job. 1 is the first in the chronological order
     */
        order: number;
}

/**
 * Represents the structure of a project
 */
interface ISourceProjectData extends ISourceData {
    /**
     * The project URL
     */
        projectLink: string;

    /**
     * The arbitrary order in which the projects will be displayed. Higher priority will be displayed first
     */
        priority: number;
}

/**
 * Represents the structure of a qualification
 */
interface ISourceQualificationData extends ISourceData {
    /**
     * The dates, as a translatable string
     */
        dates: ITranslatableString;

    /**
     * The order of the qualification. 1 is the first in the chronological order
     */
    order: number;
}

/**
 * Represents the structure of a skill
 */
interface ISourceSkillData extends ISourceData {
    /**
     * A percentage describing the level I have on this skill
     */
        level: number;

    /**
     * A comment on my level on this skill
     */
        levelComment: ITranslatableString;

    /**
     * A "more about this" link
     */
        link: ITranslatableString;
}

/**
 * Describe a tag metadata.
 * Tags can be created automatically from other data interfaces, or be explicitly described
 * Tags are sorted by popularity, that is number of items that are contained in them
 */
interface ISourceTagData {
    /**
     * The tag identifier
     */
        identifier: string;

    /**
     * The tag name
     */
        name: ITranslatableString;

    /**
     * The tag extended description
     */
        description: ITranslatableString;

    /**
     * The item's page URL
     */
        url: ITranslatableString;
}

/**
 * Represents the structure of the relationships.json file
 */
interface ISourceRelationshipData {
    /**
     * The first dimension is just an array of relations.
     * The seconds relations is a mapping of an association of two objects [0] and [1].
     * The association is commutative, that is it [A, B] is equivalent to [B, A]
     */
    relations: string[][];
}

/**
 * Represents the structure of the data that describes me
 */
interface IAboutMeData {
    /**
     * Do I need a comment for this?
     */
    firstName: string;

    /**
     * Do I need a comment for this?
     */
    lastName: string;

    /**
     * The job that I'm targeting
     */
    desiredJob: ITranslatableString;

    /**
     * The contact URL
     */
    contactUrl: ITranslatableString;

    /**
     * Which kind of jobs am I interested in?
     */
    jobInterests: ITranslatableString;
}