import { Issue, IssueData, NewIssue } from '../../models';
import { delayPromise } from '../../utils';
import { IssueRetrieverService } from './interfaces';

const UNDEFINED_DATE = new Date(0);

const MOCKS: Issue[] = [
  {
    refreshed: UNDEFINED_DATE,
    projectName: 'angular/material2',
    issueNumber: 7172,
    data: {
      issueDescription: 'Md-expansion panel opened and close events not firing on prod build (beta.11)',
      status: 'CLOSED',
      closedDate: new Date('2017-11-07T17:55:55Z'),
      latestActivityDate: new Date('2017-12-27T13:41:14Z'),
      linkProject: 'https://github.com/angular/material2',
      linkIssue: 'https://github.com/angular/material2/issues/7172',
    },
  },
  {
    refreshed: UNDEFINED_DATE,
    projectName: 'ReactiveX/rxjs',
    issueNumber: 2900,
    data: {
      issueDescription: 'Fix treeshakability when reexporting subscribeOn from operators/index.ts',
      status: 'OPEN',
      closedDate: undefined,
      latestActivityDate: new Date('2017-10-04T18:35:21Z'),
      linkProject: 'https://github.com/ReactiveX/rxjs',
      linkIssue: 'https://github.com/ReactiveX/rxjs/issues/2900',
    },
  },
];

export class MockIssueRetrieverService implements IssueRetrieverService {

  async retrieveIssue(issue: NewIssue): Promise<IssueData | undefined> {
    const matchingIssue = MOCKS.find(mockIssue =>
      (mockIssue.projectName === issue.projectName) &&
      (mockIssue.issueNumber === issue.issueNumber)
    );
    await delayPromise(5000);
    return matchingIssue ? matchingIssue.data : undefined;
  }

}
