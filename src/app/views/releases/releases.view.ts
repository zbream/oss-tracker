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
    private projectsApi: ProjectsApiService,
    private releasesDialog: ReleasesDialogService,
    private notification: NotificationService,
  ) {
    this._filterFormControl = new FormControl('');

    const projects$ = this.projectsApi.getProjects$();
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

    this._refreshInProgress$ = this.projectsApi.getRefreshInProgress$();
    this._refreshedDate$ = this.projectsApi.getRefreshedDate$();
  }

  ngOnInit() { }

  _onRefresh() {
    this.projectsApi.refreshProjects().subscribe({
      next: message => {
        this.notification.show(message);
      },
      error: err => {
        this.notification.show(err);
      },
    });
  }

  _onAdd() {
    this.releasesDialog.showAddDialog$().subscribe();
    // this.projectsApi.addProject({ name: 'rxjs', linkUrl: '', linkChangelog: '' }).subscribe({
    //   next: () => console.log('Added successfully.'),
    //   error: err => console.error(err),
    // });
  }

  readonly _trackByFn: TrackByFunction<Project> = (_index, item) => item.id;

}
