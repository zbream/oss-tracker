import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, distinctUntilChanged, map } from 'rxjs/operators';

import { firestore } from 'firebase/app';
import { collectionData, docData } from 'rxfire/firestore';

import { NewProject, Project } from '../../models/project';
import { ProjectsApiService } from '../interfaces';
import { ApiResult, FirebaseResponseService } from './firebase-response.service';
import { FirebaseService } from './firebase.service';

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

interface ApiProjectId extends ApiProject {
  id: string;
}

interface ApiProjectState {
  refreshInProgress: boolean;
  refreshed?: firestore.Timestamp | string;
}

@Injectable()
export class FirebaseProjectsApiService implements ProjectsApiService {

  private _fbFirestore: firestore.Firestore;

  constructor(
    private _http: HttpClient,
    private _fbService: FirebaseService,
    private _fbResponseService: FirebaseResponseService,
  ) {
    this._fbFirestore = this._fbService.app.firestore();
  }

  getProjects$(): Observable<Project[]> {
    return collectionData<ApiProjectId>(this._fbFirestore.collection('projects')).pipe(
      map(projects => projects.map(project => this._parseProject(project.id, project))),
    );
  }

  getRefreshInProgress$(): Observable<boolean> {
    return docData<ApiProjectState>(this._fbFirestore.doc('state/projects')).pipe(
      map(state => state.refreshInProgress),
      distinctUntilChanged(),
    );
  }

  getRefreshedDate$(): Observable<Date | undefined> {
    return docData<ApiProjectState>(this._fbFirestore.doc('state/projects')).pipe(
      map(state => state.refreshed ? this._fbResponseService.parseFirebaseDate(state.refreshed) : undefined),
      distinctUntilChanged(),
    );
  }

  addProject(newProject: NewProject): Observable<string> {
    return this._http.post<ApiResult>(`${this._fbService.api}/projects/add`, newProject).pipe(
      map(({ result }) => result),
      catchError(this._fbResponseService.parseApiError),
    );
  }

  deleteProject(id: string): Observable<string> {
    return this._http.delete<ApiResult>(`${this._fbService.api}/projects/delete/${id}`).pipe(
      map(({ result }) => result),
      catchError(this._fbResponseService.parseApiError),
    );
  }

  refreshProjects(): Observable<string> {
    return this._http.put<ApiResult>(`${this._fbService.api}/projects/refresh`, {}).pipe(
      map(({ result }) => result),
      catchError(this._fbResponseService.parseApiError),
    );
  }

  tryProject(newProject: NewProject): Observable<Project> {
    return this._http.post<ApiResult<ApiProject>>(`${this._fbService.api}/projects/info`, newProject).pipe(
      map(({ result }) => this._parseProject('', result)),
      catchError(this._fbResponseService.parseApiError),
    );
  }

  private _parseProject(id: string, apiProject: ApiProject): Project {
    return {
      id,
      name: apiProject.name,
      links: {
        url: apiProject.linkUrl,
        changelog: apiProject.linkChangelog,
      },
      latest: {
        version: apiProject.data.latestVersion,
        date: this._fbResponseService.parseFirebaseDate(apiProject.data.latestDate),
      },
      next: apiProject.data.nextVersion ? {
        version: apiProject.data.nextVersion,
        date: this._fbResponseService.parseFirebaseDate(apiProject.data.nextDate!),
      } : undefined,
    };
  }

}
