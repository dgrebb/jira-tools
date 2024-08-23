export type Task = {
	issue_type: 'Sub-task' | 'Defect';
	issue_id: number;
	parent: number;
	summary: string;
	description: string;
	assignee?: string;
	reporter?: string;
	project_name: string;
	project_key: string;
	project_type: 'Software';
};

export type Story = {
	issue_type: 'Story';
	issue_id: number;
	parent: number;
	summary: string;
	description: string;
	assignee?: string;
	reporter?: string;
	project_name: string;
	project_key: string;
	project_type: 'Software';
	tasks: Task[];
};

export type Epic = {
	issue_type: 'Epic';
	issue_id: number;
	summary: string;
	description: string;
	project_name: string;
	project_key: string;
	project_type: 'Software';
	stories: Story[];
};

export type Feature = {
	name: string;
	epics: Epic[];
};
