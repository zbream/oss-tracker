import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { ProjectsApiService } from '../../api-services/interfaces';
import { Project } from '../../models/project';
import { NotificationService } from '../../services/notification.service';
import { ReleasesDialogService } from './services/releases-dialog.service';
import { ProjectsFilterFn } from './utils/projects-filter';

@Component({
  selector: 'oss-releases-view',
  templateUrl: './releases.view.html',
  styleUrls: ['./releases.view.scss'],
})
export class ReleasesView implements OnInit {

  _filterFormControl: FormControl;

  _filteredProjects$: Observable<Project[]>;
  _refreshInProgress$: Observable<boolean>;
  _refreshedDate$: Observable<Date | undefined>;

  constructor(
    private _projectsApi: ProjectsApiService,
    private _releasesDialog: ReleasesDialogService,
    private _notification: NotificationService,
  ) {
    this._filterFormControl = new FormControl('');

    const projects$ = this._projectsApi.getProjects$();
    const filter$ = this._filterFormControl.valueChanges.pipe(
      debounceTime(150),
      startWith(this._filterFormControl.value),
    );

    this._filteredProjects$ = combineLatest(
      projects$,
      filter$,
    ).pipe(
      map(([projects, filterString]) => {
        if (filterString) {
          return projects.filter(ProjectsFilterFn(filterString));
        } else {
          return projects;
        }
      }),
    );

    this._refreshInProgress$ = this._projectsApi.getRefreshInProgress$();
    this._refreshedDate$ = this._projectsApi.getRefreshedDate$();
  }

  ngOnInit() { }

  _onRefresh() {
    this._projectsApi.refreshProjects().subscribe({
      next: message => {
        this._notification.show(message);
      },
      error: err => {
        this._notification.show(err);
      },
    });
  }

  _onAdd() {
    this._releasesDialog.showAddDialog$().subscribe();
  }

  readonly _trackByFn: TrackByFunction<Project> = (_index, item) => item.id;

}
