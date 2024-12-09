import type { IssuesType } from '@types';

export const createWorkingIssuesState = () => {
	let workingIssues: IssuesType = $state({});

	return {
		getIssues: () => {
			return workingIssues;
		},
		setIssues: (issues) => {
			workingIssues = issues;
			return workingIssues;
		}
	};
};

// Set up Client States
export const workingIssuesState = createWorkingIssuesState();
