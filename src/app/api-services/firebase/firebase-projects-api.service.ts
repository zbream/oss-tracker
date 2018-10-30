import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

import { NewProject, Project } from '../../models/project';
import { ProjectsApiService } from '../interfaces';
import { ApiResult, parseApiError } from './firebase-api-responses';
import { FIREBASE_API } from './firebase-api.token';
import { parseFirebaseDate } from './firebase-utils';

interface ApiProject {
  name: string;
  linkUrl: string;
  linkChangelog: string;
  data: {
    latestVersion: string;
    latestDate: firestore.Timestamp | string;
    nextVersion?: string;
    nextDate?: firestore.Timestamp | string;
  };
}

interface ApiProjectState {
  refreshInProgress: boolean;
  refreshed?: firestore.Timestamp | string;
}

@Injectable()
export class FirebaseProjectsApiService implements ProjectsApiService {

  constructor(
    @Inject(FIREBASE_API) private api: string,
    private http: HttpClient,
    private ngFirestore: AngularFirestore,
  ) {}

  getProjects$(): Observable<Project[]> {
    return this.ngFirestore.collection<ApiProject>('projects').snapshotChanges().pipe(
      map(actions => actions.map(action => {
        const id = action.payload.doc.id;
        const project = action.payload.doc.data() as ApiProject;
        return this.parseProject(id, project);
      })),
    );
  }

  getRefreshInProgress$(): Observable<boolean> {
    return this.ngFirestore.doc<ApiProjectState>('state/projects').valueChanges().pipe(
      map(state => state ? state.refreshInProgress : false),
    );
  }

  getRefreshedDate$(): Observable<Date | undefined> {
    return this.ngFirestore.doc<ApiProjectState>('state/projects').valueChanges().pipe(
      map(state => (state && state.refreshed) ? parseFirebaseDate(state.refreshed) : undefined),
    );
  }

  addProject(newProject: NewProject): Observable<string> {
    return this.http.post<ApiResult>(`${this.api}/projects/add`, newProject).pipe(
      map(response => response.result),
      catchError(parseApiError),
    );
  }

  deleteProject(id: string): Observable<string> {
    return this.http.delete<ApiResult>(`${this.api}/projects/delete/${id}`).pipe(
      map(response => response.result),
      catchError(parseApiError),
    );
  }

  refreshProjects(): Observable<string> {
    return this.http.put<ApiResult>(`${this.api}/projects/refresh`, {}).pipe(
      map(response => response.result),
      catchError(parseApiError),
    );
  }

  tryProject(newProject: NewProject): Observable<Project> {
    return this.http.post<ApiResult<ApiProject>>(`${this.api}/projects/info`, newProject).pipe(
      map(response => this.parseProject('', response.result)),
      catchError(parseApiError),
    );
  }

  private parseProject(id: string, apiProject: ApiProject): Project {
    return {
      id,
      name: apiProject.name,
      links: {
        url: apiProject.linkUrl,
        changelog: apiProject.linkChangelog,
      },
      latest: {
        version: apiProject.data.latestVersion,
        date: parseFirebaseDate(apiProject.data.latestDate),
      },
      next: apiProject.data.nextVersion ? {
        version: apiProject.data.nextVersion!,
        date: parseFirebaseDate(apiProject.data.nextDate!),
      } : undefined,
    };
  }

}
