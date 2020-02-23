import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AddIssueDialogComponent } from '../components/add-issue-dialog/add-issue-dialog.component';

@Injectable()
export class IssuesDialogService {

  constructor(
    private _dialog: MatDialog,
  ) {}

  showAddDialog$(): Observable<void> {
    return this._dialog.open(AddIssueDialogComponent, {
      width: '400px',
    }).afterClosed();
  }

}
