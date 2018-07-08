import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { IssuesApiService } from '../../api-services/interfaces';
import { Issue } from '../../models/issue';
import { NotificationService } from '../../services/notification.service';
import { IssuesDialogService } from './services/issues-dialog.service';
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
    private issuesDialog: IssuesDialogService,
    private notification: NotificationService,
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
      map(([issues, filterString]) => {
        if (filterString) {
          return issues.filter(IssuesFilterFn(filterString));
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
    this.issuesApi.refreshIssues().subscribe({
      next: message => {
        this.notification.show(message);
      },
      error: err => {
        this.notification.show(err);
      },
    });
  }

  _onAdd() {
    this.issuesDialog.showAddDialog$().subscribe();
    // this.issuesApi.addIssue({ projectName: 'ReactiveX/rxjs', issueNumber: 2900 }).subscribe({
    //   next: () => console.log('Added successfully'),
    //   error: err => console.error(err),
    // });
  }

  readonly _trackByFn: TrackByFunction<Issue> = (index, item) => item.id;
}
