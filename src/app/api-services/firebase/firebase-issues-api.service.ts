import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Issue, NewIssue } from '../../models/issue';
import { IssuesApiService } from '../interfaces';
import { ApiResult, parseApiError } from './firebase-api-responses';
import { FIREBASE_API } from './firebase-api.token';

interface ApiIssue {
  projectName: string;
  issueNumber: number;
  data: {
    issueDescription: string;
    status: string;
    closedDate?: Date;
    latestActivityDate: Date;
    linkProject: string;
    linkIssue: string;
  };
}

interface ApiIssueState {
  refreshInProgress: boolean;
  refreshed?: Date;
}

@Injectable()
export class FirebaseIssuesApiService implements IssuesApiService {

  constructor(
    @Inject(FIREBASE_API) private api: string,
    private http: HttpClient,
    private firestore: AngularFirestore,
  ) {}

  getIssues$(): Observable<Issue[]> {
    return this.firestore.collection<ApiIssue>('issues').snapshotChanges().pipe(
      map(actions => actions.map(action => {
        const id = action.payload.doc.id;
        const issue = action.payload.doc.data() as ApiIssue;
        return this.parseIssue(id, issue);
      })),
    );
  }

  getRefreshInProgress$(): Observable<boolean> {
    return this.firestore.doc<ApiIssueState>('state/issues').valueChanges().pipe(
      map(state => state ? state.refreshInProgress : false),
    );
  }

  getRefreshedDate$(): Observable<Date | undefined> {
    return this.firestore.doc<ApiIssueState>('state/issues').valueChanges().pipe(
      map(state => state ? state.refreshed : undefined),
    );
  }

  addIssue(newIssue: NewIssue): Observable<void> {
    return this.http.post<ApiResult>(`${this.api}/issues/add`, newIssue).pipe(
      map(response => undefined),
      catchError(parseApiError),
    );
  }

  deleteIssue(id: string): Observable<void> {
    return this.http.delete<ApiResult>(`${this.api}/issues/delete/${id}`).pipe(
      map(response => undefined),
      catchError(parseApiError),
    );
  }

  refreshIssues(): Observable<void> {
    return this.http.put<ApiResult>(`${this.api}/issues/refresh`, {}).pipe(
      map(response => undefined),
      catchError(parseApiError),
    );
  }

  tryIssue(newIssue: NewIssue): Observable<Issue> {
    return this.http.post<ApiResult<ApiIssue>>(`${this.api}/issues/info`, newIssue).pipe(
      map(response => this.parseIssue('', response.result)),
      catchError(parseApiError),
    );
  }

  private parseIssue(id: string, apiIssue: ApiIssue): Issue {
    return {
      id,
      project: apiIssue.projectName,
      issue: apiIssue.issueNumber,
      description: apiIssue.data.issueDescription,
      status: apiIssue.data.status,
      closedDate: apiIssue.data.closedDate,
      latestActivityDate: apiIssue.data.latestActivityDate,
      links: {
        project: apiIssue.data.linkProject,
        issue: apiIssue.data.linkIssue,
      },
    };
  }
}
