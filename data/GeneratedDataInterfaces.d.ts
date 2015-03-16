/**
 * The interfaces that represents the generated data.
 * The generated data are source data decorated with relationship attributes
 */
///<reference path='../i18n/i18nInterfaces.d.ts' />
///<reference path='./sourceDataInterfaces.d.ts' />

/**
 * Represents the item's relationship with other items
 */
interface IItemRelationship {
    jobs: string[];
    projects: string[];
    qualifications: string[];
    skills: string[];
    [index: string]: any;
}

interface IGeneratedJobData extends ISourceJobData, IItemRelationship {
}

interface IGeneratedProjectData extends ISourceProjectData, IItemRelationship {
}

interface IGeneratedQualificationData extends ISourceQualificationData, IItemRelationship {
}

interface IGeneratedSkillData extends ISourceSkillData, IItemRelationship {
}

interface IGeneratedTagData extends ISourceTagData, IItemRelationship {
}

/**
 * The generated object in which data will be searched
 */
interface IGeneratedDatabase {
    jobs: {
        [index:string] : IGeneratedJobData;
    };

    projects: {
        [index:string] : IGeneratedProjectData;
    };

    qualifications: {
        [index:string] : IGeneratedQualificationData;
    };

    skills: {
        [index:string] : IGeneratedSkillData;
    };

    tags: {
        [index:string] : IGeneratedTagData;
    };

    /**
     * The object where we can find the association "translated URL" => "item identifier"
     * for example ["fr-FR"]["competences"]["javascript"] will have a value of "skills/javascript"
     */
    url: ITranslatableContent<{
        [index:string] : {
            [index:string] : string
        };
    }>;

    [index:string] : any;
}

/**
 * An abstract generic interface for every generated data item
 */
interface IGeneratedDataItem extends ISourceData, IItemRelationship {
}