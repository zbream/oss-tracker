import { Project } from '../../models/project';

export const MOCK_PROJECTS: Project[] = [
  {
    id: uid('@angular/core'),
    name: '@angular/core',
    latest: {
      version: '5.2.6',
      date: new Date('2018-02-22T00:53:08.593Z'),
    },
    next: {
      version: '6.0.0-beta.5',
      date: new Date('2018-02-22T01:18:11.613Z'),
    },
    links: {
      url: 'http://github.com/angular/angular',
      changelog: 'https://github.com/angular/angular/blob/master/CHANGELOG.md',
    },
  },
  {
    id: uid('@angular/material'),
    name: '@angular/material',
    latest: {
      version: '5.2.2',
      date: new Date('2018-02-21T00:35:57.327Z'),
    },
    next: {
      version: '6.0.0-beta.2',
      date: new Date('2018-02-21T01:09:18.542Z'),
    },
    links: {
      url: 'https://github.com/angular/material2',
      changelog: 'https://github.com/angular/material2/blob/master/CHANGELOG.md',
    },
  },
  {
    id: uid('@angular/cli'),
    name: '@angular/cli',
    latest: {
      version: '1.7.1',
      date: new Date('2018-02-22T03:08:27.145Z'),
    },
    next: {
      version: '6.0.0-beta.3',
      date: new Date('2018-02-22T03:36:19.471Z'),
    },
    links: {
      url: 'https://github.com/angular/angular-cli',
      changelog: 'https://github.com/angular/angular-cli/releases',
    },
  },
  {
    id: uid('rxjs'),
    name: 'rxjs',
    latest: {
      version: '5.5.6',
      date: new Date('2017-12-21T21:48:57.218Z'),
    },
    next: {
      version: '6.0.0-alpha.3',
      date: new Date('2018-02-09T17:06:57.961Z'),
    },
    links: {
      url: 'https://github.com/ReactiveX/rxjs',
      changelog: 'https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md',
    },
  },
];

function uid(name: string): string {
  return btoa(`${name}`);
}
