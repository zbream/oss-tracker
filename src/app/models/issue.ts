export interface Issue {
  id: string;
  project: string;
  issue: number;
  description: string;
  status: string;
  closedDate?: Date;
  latestActivityDate: Date;
  links: {
    project: string;
    issue: string;
  };
}

export interface NewIssue {
  projectName: string;
  issueNumber: number;
}
