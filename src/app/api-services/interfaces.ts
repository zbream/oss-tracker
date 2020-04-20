import { Observable } from 'rxjs';

import { Issue, NewIssue } from '../models/issue';
import { NewProject, Project } from '../models/project';

// tslint:disable max-classes-per-file

export abstract class IssuesApiService {
  abstract getIssues$(recent?: boolean): Observable<Issue[]>;
  abstract getRefreshInProgress$(): Observable<boolean>;
  abstract getRefreshedDate$(): Observable<Date | undefined>;
  abstract addIssue(newIssue: NewIssue): Observable<string>;
  abstract deleteIssue(id: string): Observable<string>;
  abstract refreshIssues(): Observable<string>;
  abstract tryIssue(newIssue: NewIssue): Observable<Issue>;
}

export abstract class ProjectsApiService {
  abstract getProjects$(): Observable<Project[]>;
  abstract getRefreshInProgress$(): Observable<boolean>;
  abstract getRefreshedDate$(): Observable<Date | undefined>;
  abstract addProject(newProject: NewProject): Observable<string>;
  abstract deleteProject(id: string): Observable<string>;
  abstract refreshProjects(): Observable<string>;
  abstract tryProject(newProject: NewProject): Observable<Project>;
}
