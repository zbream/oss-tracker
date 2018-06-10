import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Timestamp } from '@firebase/firestore-types';
import { AngularFirestore } from 'angularfire2/firestore';

import { NewProject, Project } from '../../models/project';
import { ProjectsApiService } from '../interfaces';
import { ApiResult, parseApiError } from './firebase-api-responses';
import { FIREBASE_API } from './firebase-api.token';

interface ApiProject {
  name: string;
  linkUrl: string;
  linkChangelog: string;
  data: {
    latestVersion: string;
    latestDate: Timestamp;
    nextVersion?: string;
    nextDate?: Timestamp;
  };
}

interface ApiProjectState {
  refreshInProgress: boolean;
  refreshed?: Timestamp;
}

@Injectable()
export class FirebaseProjectsApiService implements ProjectsApiService {

  constructor(
    @Inject(FIREBASE_API) private api: string,
    private http: HttpClient,
    private firestore: AngularFirestore,
  ) {}

  getProjects$(): Observable<Project[]> {
    return this.firestore.collection<ApiProject>('projects').snapshotChanges().pipe(
      map(actions => actions.map(action => {
        const id = action.payload.doc.id;
        const project = action.payload.doc.data() as ApiProject;
        return this.parseProject(id, project);
      })),
    );
  }

  getRefreshInProgress$(): Observable<boolean> {
    return this.firestore.doc<ApiProjectState>('state/projects').valueChanges().pipe(
      map(state => state ? state.refreshInProgress : false),
    );
  }

  getRefreshedDate$(): Observable<Date | undefined> {
    return this.firestore.doc<ApiProjectState>('state/projects').valueChanges().pipe(
      map(state => (state && state.refreshed) ? state.refreshed.toDate() : undefined),
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
        date: apiProject.data.latestDate.toDate(),
      },
      next: apiProject.data.nextVersion ? {
        version: apiProject.data.nextVersion!,
        date: apiProject.data.nextDate!.toDate(),
      } : undefined,
    };
  }

}
