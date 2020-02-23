import { NewProject, Project, ProjectData } from '../../models';
import { delayPromise } from '../../utils';
import { ProjectRetrieverService } from './interfaces';

const UNDEFINED_DATE = new Date(0);

const MOCKS: Project[] = [
  {
    refreshed: UNDEFINED_DATE,
    name: '@angular/core',
    linkUrl: 'http://github.com/angular/angular',
    linkChangelog: 'http://github.com/angular/angular/blob/master/CHANGELOG.md',
    nextTag: 'next',
    data: {
      latestVersion: '5.2.9',
      latestDate: new Date('2018-03-14T22:20:07.955Z'),
      nextVersion: '6.0.0-rc.0',
      nextDate: new Date('2018-03-21T05:57:47.276Z'),
    },
  },
  {
    refreshed: UNDEFINED_DATE,
    name: '@angular/material',
    linkUrl: 'https://github.com/angular/material2',
    linkChangelog: 'https://github.com/angular/material2/blob/master/CHANGELOG.md',
    nextTag: 'next',
    data: {
      latestVersion: '5.2.4',
      latestDate: new Date('2018-03-06T18:42:02.508Z'),
      nextVersion: '6.0.0-beta.5',
      nextDate: new Date('2018-03-23T20:11:48.342Z'),
    },
  },
  {
    refreshed: UNDEFINED_DATE,
    name: '@angular/cli',
    linkUrl: 'https://github.com/angular/angular-cli',
    linkChangelog: 'https://github.com/angular/angular-cli/releases',
    nextTag: 'next',
    data: {
      latestVersion: '1.7.3',
      latestDate: new Date('2018-03-08T00:57:12.338Z'),
      nextVersion: '6.0.0-beta.7',
      nextDate: new Date('2018-03-27T15:52:15.116Z'),
    },
  },
  {
    refreshed: UNDEFINED_DATE,
    name: 'rxjs',
    linkUrl: 'https://github.com/ReactiveX/rxjs',
    linkChangelog: 'https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md',
    nextTag: 'alpha',
    data: {
      latestVersion: '5.5.8',
      latestDate: new Date('2018-03-27T05:35:45.69Z'),
      nextVersion: '6.0.0-alpha.4',
      nextDate: new Date('2018-03-13T19:00:55.397Z'),
    },
  },
];

export class MockProjectRetrieverService implements ProjectRetrieverService {

  async retrieveProject(project: NewProject): Promise<ProjectData | undefined> {
    const matchingProject = MOCKS.find(mockProject =>
      (mockProject.name === project.name)
    );
    await delayPromise(5000);
    return matchingProject?.data;
  }

}
