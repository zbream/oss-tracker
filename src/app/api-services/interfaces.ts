import { Observable } from 'rxjs';

import { Issue, NewIssue } from '../models/issue';
import { NewProject, Project } from '../models/project';

// tslint:disable max-classes-per-file

export abstract class IssuesApiService {
  abstract getIssues$(): Observable<Issue[]>;
  abstract getRefreshInProgress$(): Observable<boolean>;
  abstract getRefreshedDate$(): Observable<Date | undefined>;
  abstract addIssue(newIssue: NewIssue): Observable<void>;
  abstract deleteIssue(id: string): Observable<void>;
  abstract refreshIssues(): Observable<void>;
  abstract tryIssue(newIssue: NewIssue): Observable<Issue>;
}

export abstract class ProjectsApiService {
  abstract getProjects$(): Observable<Project[]>;
  abstract getRefreshInProgress$(): Observable<boolean>;
  abstract getRefreshedDate$(): Observable<Date | undefined>;
  abstract addProject(newProject: NewProject): Observable<void>;
  abstract deleteProject(id: string): Observable<void>;
  abstract refreshProjects(): Observable<void>;
  abstract tryProject(newProject: NewProject): Observable<Project>;
}
