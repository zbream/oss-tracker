import { propertiesOf } from '../utils';

export interface NewIssue
  extends Pick<Issue, 'projectName' | 'issueNumber'> {}

export interface Issue {
  refreshed: Date;
  projectName: string;
  issueNumber: number;
  data: IssueData;
}

export interface IssueData {
  issueDescription: string;
  status: string;
  closedDate?: Date;
  latestActivityDate?: Date;
  linkProject: string;
  linkIssue: string;
}

export const NEW_ISSUE_PROPS = propertiesOf<NewIssue>(
  'projectName', 'issueNumber',
);
