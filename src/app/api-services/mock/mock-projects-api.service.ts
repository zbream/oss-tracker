import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

import { NewProject, Project } from '../../models/project';
import { ProjectsApiService } from '../interfaces';
import { MOCK_PROJECTS } from './mock-projects';

const DELAY = 500;

const INIT_PROJECTS: Project[] = [
  // MOCK_PROJECTS[0],
  ...MOCK_PROJECTS,
];

const INIT_REFRESH_IN_PROGRESS = false;

const INIT_REFRESHED_DATE: Date | undefined = new Date(2017, 6, 21, 1, 23, 45);

@Injectable()
export class MockProjectsApiService implements ProjectsApiService {

  private _projectsSubject = new BehaviorSubject(INIT_PROJECTS);
  private _refreshInProgressSubject = new BehaviorSubject(INIT_REFRESH_IN_PROGRESS);
  private _refreshedDateSubject = new BehaviorSubject(INIT_REFRESHED_DATE);

  getProjects$(): Observable<Project[]> {
    return this._projectsSubject.asObservable().pipe(
      map(projects => projects.sort(descCompareFn)),
    );
  }

  getRefreshInProgress$(): Observable<boolean> {
    return this._refreshInProgressSubject.asObservable();
  }

  getRefreshedDate$(): Observable<Date | undefined> {
    return this._refreshedDateSubject.asObservable();
  }

  addProject(newProject: NewProject): Observable<void> {
    return of(undefined).pipe(
      delay(DELAY),
      tap(() => {

        const alreadyExists = this._projectsSubject.value.some(matchFn(newProject));
        if (alreadyExists) {
          throw new Error('The project already exists in the database.');
        }

        const matchingProject = MOCK_PROJECTS.find(matchFn(newProject));
        if (!matchingProject) {
          throw new Error('Failed to find project.');
        }

        this._projectsSubject.next([
          ...this._projectsSubject.value,
          matchingProject,
        ]);

      }),
      delay(DELAY),
    );
  }

  deleteProject(id: string): Observable<void> {
    return of(undefined).pipe(
      delay(DELAY),
      tap(() => {

        const index = this._projectsSubject.value.findIndex(project => project.id === id);
        if (index < 0) {
          throw new Error('Project does not exist in the database.');
        }

        this._projectsSubject.next([
          ...this._projectsSubject.value.slice(0, index),
          ...this._projectsSubject.value.slice(index + 1),
        ]);

      }),
      delay(DELAY),
    );
  }

  refreshProjects(): Observable<void> {
    return of(undefined).pipe(
      delay(DELAY),
      tap(() => {
        this._refreshInProgressSubject.next(true);
        this._refreshedDateSubject.next(new Date(Date.now()));
      }),
      delay(DELAY * 5),
      tap(() => {
        this._refreshInProgressSubject.next(false);
      }),
      delay(DELAY),
    );
  }

  tryProject(newProject: NewProject): Observable<Project> {
    return of(undefined).pipe(
      delay(DELAY),
      map(() => {
        const matchingProject = MOCK_PROJECTS.find(matchFn(newProject));
        if (!matchingProject) {
          throw new Error('Failed to find project.');
        }
        return matchingProject;
      }),
      delay(DELAY),
    );
  }

}

function matchFn(newProject: NewProject) {
  return (project: Project) => (
    (newProject.name === project.name)
  );
}

function ascCompareFn(a: Project, b: Project) {
  return a.latest.date.getTime() - b.latest.date.getTime();
}

function descCompareFn(a: Project, b: Project) {
  return b.latest.date.getTime() - a.latest.date.getTime();
}
