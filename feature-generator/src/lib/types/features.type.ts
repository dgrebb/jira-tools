export interface FeatureType {
	summary: string;
	description: string;
	epics: EpicType[];
}

export interface EpicType {
	issuetype: string;
	issue_id: number;
	parent: number | null;
	summary: string;
	description: string;
	assignee: string;
	reporter: string;
	project_name: string;
	project_key: string;
	project_type: string;
	stories: StoryType[];
}

export interface StoryType {
	issuetype: string;
	issue_id: number;
	parent: number;
	summary: string;
	description: string;
	assignee: string;
	reporter: string;
	project_name: string;
	project_key: string;
	project_type: string;
	tasks: TaskType[];
}

export interface TaskType {
	issuetype: string;
	issue_id: number;
	parent: number;
	summary: string;
	description: string;
	assignee: string;
	reporter: string;
	project_name: string;
	project_key: string;
	project_type: string;
}
