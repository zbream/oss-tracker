import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { IssuesApiService } from '../../api-services/interfaces';
import { Issue } from '../../models/issue';

@Component({
  selector: 'oss-issues-view',
  templateUrl: './issues.view.html',
  styleUrls: ['./issues.view.scss'],
})
export class IssuesView implements OnInit {

  _issues$: Observable<Issue[]>;

  constructor(
    private issuesApi: IssuesApiService,
  ) {
    this._issues$ = this.issuesApi.getIssues$();
  }

  ngOnInit() { }
}
