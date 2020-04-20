import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { catchError, distinctUntilChanged, map } from 'rxjs/operators';

import { firestore } from 'firebase/app';
import { collectionData, docData } from 'rxfire/firestore';

import { Issue, NewIssue } from '../../models/issue';
import { IssuesApiService } from '../interfaces';
import { ApiResult, FirebaseResponseService } from './firebase-response.service';
import { FirebaseService } from './firebase.service';

// How far back is "recent", in days.
const RECENT_DAYS = 14;

interface ApiIssue {
  projectName: string;
  issueNumber: number;
  data: {
    issueDescription: string;
    status: string;
    closedDate?: firestore.Timestamp | string;
    latestActivityDate: firestore.Timestamp | string;
    linkProject: string;
    linkIssue: string;
  };
}

interface ApiIssueId extends ApiIssue {
  id: string;
}

interface ApiIssueState {
  refreshInProgress: boolean;
  refreshed?: firestore.Timestamp;
}

@Injectable()
export class FirebaseIssuesApiService implements IssuesApiService {

  private _fbFirestore: firestore.Firestore;

  constructor(
    private _http: HttpClient,
    private _fbService: FirebaseService,
    private _fbResponseService: FirebaseResponseService,
  ) {
    this._fbFirestore = this._fbService.app.firestore();
  }

  getIssues$(recent = true): Observable<Issue[]> {
    let data: Observable<ApiIssueId[]>;
    if (recent) {
      const today = new Date();
      const minDate = new Date(today.setDate(today.getDate() - RECENT_DAYS));
      const openQuery = this._fbFirestore.collection('issues')
        .where('data.status', '==', 'OPEN');
      const closedQuery = this._fbFirestore.collection('issues')
        .where('data.status', '==', 'CLOSED')
        .where('data.closedDate', '>=', minDate);
      data = zip(
        collectionData<ApiIssueId>(openQuery, 'id'),
        collectionData<ApiIssueId>(closedQuery, 'id'),
      ).pipe(
        map(([a1, a2]) => ([...a1, ...a2])),
      );
    } else {
      const query = this._fbFirestore.collection('issues');
      data = collectionData<ApiIssueId>(query, 'id');
    }
    return data.pipe(
      map(issues => issues.map(issue => this._parseIssue(issue.id, issue))),
    );
  }

  getRefreshInProgress$(): Observable<boolean> {
    return docData<ApiIssueState>(this._fbFirestore.doc('state/issues')).pipe(
      map(state => state.refreshInProgress),
      distinctUntilChanged(),
    );
  }

  getRefreshedDate$(): Observable<Date | undefined> {
    return docData<ApiIssueState>(this._fbFirestore.doc('state/issues')).pipe(
      map(state => state.refreshed ? this._fbResponseService.parseFirebaseDate(state.refreshed) : undefined),
      distinctUntilChanged(),
    );
  }

  addIssue(newIssue: NewIssue): Observable<string> {
    return this._http.post<ApiResult>(`${this._fbService.api}/issues/add`, newIssue).pipe(
      map(({ result }) => result),
      catchError(this._fbResponseService.parseApiError),
    );
  }

  deleteIssue(id: string): Observable<string> {
    return this._http.delete<ApiResult>(`${this._fbService.api}/issues/delete/${id}`).pipe(
      map(({ result }) => result),
      catchError(this._fbResponseService.parseApiError),
    );
  }

  refreshIssues(): Observable<string> {
    return this._http.put<ApiResult>(`${this._fbService.api}/issues/refresh`, {}).pipe(
      map(({ result }) => result),
      catchError(this._fbResponseService.parseApiError),
    );
  }

  tryIssue(newIssue: NewIssue): Observable<Issue> {
    return this._http.post<ApiResult<ApiIssue>>(`${this._fbService.api}/issues/info`, newIssue).pipe(
      map(({ result }) => this._parseIssue('', result)),
      catchError(this._fbResponseService.parseApiError),
    );
  }

  private _parseIssue(id: string, apiIssue: ApiIssue): Issue {
    return {
      id,
      project: apiIssue.projectName,
      issue: apiIssue.issueNumber,
      description: apiIssue.data.issueDescription,
      status: apiIssue.data.status,
      closedDate: apiIssue.data.closedDate ? this._fbResponseService.parseFirebaseDate(apiIssue.data.closedDate) : undefined,
      latestActivityDate: this._fbResponseService.parseFirebaseDate(apiIssue.data.latestActivityDate),
      links: {
        project: apiIssue.data.linkProject,
        issue: apiIssue.data.linkIssue,
      },
    };
  }

}
