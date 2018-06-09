import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { NewProject } from '../../../models/project';
import { AddProjectDialogComponent } from '../components/add-project-dialog/add-project-dialog.component';

@Injectable()
export class ReleasesDialogService {

  constructor(
    private dialog: MatDialog,
  ) {}

  showAddDialog$(): Observable<NewProject | undefined> {
    return this.dialog.open(AddProjectDialogComponent, {
      width: '400px',
    }).afterClosed();
  }

}
