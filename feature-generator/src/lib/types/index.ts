export * from './features.type';
export type IssueType = {
	summary: string;
	description: string;
	issuetype: string;
	reporter: string;
	epics?: unknown[];
	stories?: unknown[];
	tasks?: unknown[];
};
