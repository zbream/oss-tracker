import { IssueData, NewIssue, NewProject, ProjectData } from '../../models';

export interface IssueRetrieverService {
  retrieveIssue(issue: NewIssue): Promise<IssueData | undefined>;
}

export interface ProjectRetrieverService {
  retrieveProject(project: NewProject): Promise<ProjectData | undefined>;
}
