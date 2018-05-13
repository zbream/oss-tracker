import { Issue } from '../../models/issue';

export const MOCK_ISSUES: Issue[] = [
  {
    id: uid('angular/material2', 7172),
    project: 'angular/material2',
    issue: 7172,
    description: 'Md-expansion panel opened and close events not firing on prod build (beta.11)',
    status: 'CLOSED',
    closedDate: new Date('2017-11-07T17:55:55Z'),
    latestActivityDate: new Date('2017-12-27T13:41:14Z'),
    links: {
      project: 'https://github.com/angular/material2',
      issue: 'https://github.com/angular/material2/issues/7172',
    },
  },
  {
    id: uid('ReactiveX/rxjs', 2900),
    project: 'ReactiveX/rxjs',
    issue: 2900,
    description: 'Fix treeshakability when reexporting subscribeOn from operators/index.ts',
    status: 'OPEN',
    closedDate: undefined,
    latestActivityDate: new Date('2017-10-04T18:35:21Z'),
    links: {
      project: 'https://github.com/ReactiveX/rxjs',
      issue: 'https://github.com/ReactiveX/rxjs/issues/2900',
    },
  },
];

function uid(project: string, issue: number): string {
  return btoa(`${project}/${issue}`);
}
