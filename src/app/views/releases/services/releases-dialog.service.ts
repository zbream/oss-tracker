import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AddProjectDialogComponent } from '../components/add-project-dialog/add-project-dialog.component';

@Injectable()
export class ReleasesDialogService {

  constructor(
    private _dialog: MatDialog,
  ) {}

  showAddDialog$(): Observable<undefined> {
    return this._dialog.open(AddProjectDialogComponent, {
      width: '400px',
    }).afterClosed();
  }

}
