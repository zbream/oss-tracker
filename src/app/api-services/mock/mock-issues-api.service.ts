import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

import { Issue, NewIssue } from '../../models/issue';
import { IssuesApiService } from '../interfaces';
import { MOCK_ISSUES } from './mock-issues';

const DELAY = 500;

const INIT_ISSUES: Issue[] = [
  // MOCK_ISSUES[0],
  ...MOCK_ISSUES,
];

const INIT_REFRESH_IN_PROGRESS = false;

const INIT_REFRESHED: Date | undefined = new Date(2017, 7, 21, 1, 23, 45);

@Injectable()
export class MockIssuesApiService implements IssuesApiService {

  private _issuesSubject = new BehaviorSubject(INIT_ISSUES);
  private _refreshInProgressSubject = new BehaviorSubject(INIT_REFRESH_IN_PROGRESS);
  private _refreshedSubject = new BehaviorSubject(INIT_REFRESHED);

  getIssues$(): Observable<Issue[]> {
    return this._issuesSubject.asObservable().pipe(
      map(projects => projects.sort(descCompareFn)),
    );
  }

  getRefreshInProgress$(): Observable<boolean> {
    return this._refreshInProgressSubject.asObservable();
  }

  getRefreshedDate$(): Observable<Date | undefined> {
    return this._refreshedSubject.asObservable();
  }

  addIssue(newIssue: NewIssue): Observable<void> {
    return of(undefined).pipe(
      delay(DELAY),
      tap(() => {

        const alreadyExists = this._issuesSubject.value.some(matchFn(newIssue));
        if (alreadyExists) {
          throw new Error('The issue already exists in the database.');
        }

        const matchingIssue = MOCK_ISSUES.find(matchFn(newIssue));
        if (!matchingIssue) {
          throw new Error('Failed to find repo or issue.');
        }

        this._issuesSubject.next([
          ...this._issuesSubject.value,
          matchingIssue,
        ]);

      }),
      delay(DELAY),
    );
  }

  deleteIssue(id: string): Observable<void> {
    return of(undefined).pipe(
      delay(DELAY),
      tap(() => {

        const index = this._issuesSubject.value.findIndex(issue => issue.id === id);
        if (index < 0) {
          throw new Error('Issue does not exist in the database.');
        }

        this._issuesSubject.next([
          ...this._issuesSubject.value.slice(0, index),
          ...this._issuesSubject.value.slice(index + 1),
        ]);

      }),
      delay(DELAY),
    );
  }

  refreshIssues(): Observable<void> {
    return of(undefined).pipe(
      delay(DELAY),
      tap(() => {
        this._refreshInProgressSubject.next(true);
        this._refreshedSubject.next(new Date(Date.now()));
      }),
      delay(DELAY * 5),
      tap(() => {
        this._refreshInProgressSubject.next(false);
      }),
      delay(DELAY),
    );
  }

  tryIssue(newIssue: NewIssue): Observable<Issue> {
    return of(undefined).pipe(
      delay(DELAY),
      map(() => {
        const matchingIssue = MOCK_ISSUES.find(matchFn(newIssue));
        if (!matchingIssue) {
          throw new Error('Failed to find repo or issue.');
        }
        return matchingIssue;
      }),
    );
  }

}

function matchFn(newIssue: NewIssue) {
  return (issue: Issue) => (
    (newIssue.projectName === issue.project) &&
    (newIssue.issueNumber === issue.issue)
  );
}

function ascCompareFn(a: Issue, b: Issue) {
  return a.latestActivityDate.getTime() - b.latestActivityDate.getTime();
}

function descCompareFn(a: Issue, b: Issue) {
  return b.latestActivityDate.getTime() - a.latestActivityDate.getTime();
}
