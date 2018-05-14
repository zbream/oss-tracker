import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { IssuesApiService } from '../../api-services/interfaces';
import { Issue } from '../../models/issue';
import { IssuesFilterFn } from './utils/issues-filter';

@Component({
  selector: 'oss-issues-view',
  templateUrl: './issues.view.html',
  styleUrls: ['./issues.view.scss'],
})
export class IssuesView implements OnInit {

  _filterFormControl: FormControl;

  _filteredIssues$: Observable<Issue[]>;
  _refreshInProgress$: Observable<boolean>;
  _refreshedDate$: Observable<Date | undefined>;

  constructor(
    private issuesApi: IssuesApiService,
  ) {
    this._filterFormControl = new FormControl('');

    const issues$ = this.issuesApi.getIssues$();
    const filter$ = this._filterFormControl.valueChanges.pipe(
      debounceTime(150),
      startWith(this._filterFormControl.value),
    );

    this._filteredIssues$ = combineLatest(
      issues$,
      filter$,
    ).pipe(
      map(([issues, filter]) => {
        if (filter) {
          return issues.filter(IssuesFilterFn(filter));
        } else {
          return issues;
        }
      }),
    );

    this._refreshInProgress$ = this.issuesApi.getRefreshInProgress$();
    this._refreshedDate$ = this.issuesApi.getRefreshedDate$();
  }

  ngOnInit() { }

  _onRefresh() {
    this.issuesApi.refreshIssues().subscribe();
  }

  _onAdd() {
    this.issuesApi.addIssue({ projectName: 'ReactiveX/rxjs', issueNumber: 2900 }).subscribe({
      next: () => console.log('Added successfully'),
      error: err => console.error(err),
    });
  }

  readonly _trackByFn: TrackByFunction<Issue> = (index, item) => item.id;
}
