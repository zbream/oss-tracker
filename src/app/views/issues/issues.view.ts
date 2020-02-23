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
    private _issuesApi: IssuesApiService,
    private _issuesDialog: IssuesDialogService,
    private _notification: NotificationService,
  ) {
    this._filterFormControl = new FormControl('');

    const issues$ = this._issuesApi.getIssues$();
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

    this._refreshInProgress$ = this._issuesApi.getRefreshInProgress$();
    this._refreshedDate$ = this._issuesApi.getRefreshedDate$();
  }

  ngOnInit() { }

  _onRefresh() {
    this._issuesApi.refreshIssues().subscribe({
      next: message => {
        this._notification.show(message);
      },
      error: err => {
        this._notification.show(err);
      },
    });
  }

  _onAdd() {
    this._issuesDialog.showAddDialog$().subscribe();
  }

  readonly _trackByFn: TrackByFunction<Issue> = (index, item) => item.id;
}
