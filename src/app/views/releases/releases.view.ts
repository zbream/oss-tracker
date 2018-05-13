import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectsApiService } from '../../api-services/interfaces';
import { Project } from '../../models/project';

@Component({
  selector: 'oss-releases-view',
  templateUrl: './releases.view.html',
  styleUrls: ['./releases.view.scss'],
})
export class ReleasesView implements OnInit {

  _projects$: Observable<Project[]>;

  constructor(
    private projectsApi: ProjectsApiService,
  ) {
    this._projects$ = this.projectsApi.getProjects$();
  }

  ngOnInit() { }
}
