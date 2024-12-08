export * from './features.type';
export type IssuesType = {
	summary?: string;
	description?: string;
	issuetype?: string;
	reporter?: string;
	features?: FeatureType[];
	epics?: EpicType[];
	stories?: StoryType[];
	tasks?: TaskType[];
};
