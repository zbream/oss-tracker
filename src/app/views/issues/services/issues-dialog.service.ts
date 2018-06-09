import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { NewIssue } from '../../../models/issue';
import { AddIssueDialogComponent } from '../components/add-issue-dialog/add-issue-dialog.component';

@Injectable()
export class IssuesDialogService {

  constructor(
    private dialog: MatDialog,
  ) {}

  showAddDialog$(): Observable<NewIssue | undefined> {
    return this.dialog.open(AddIssueDialogComponent, {
      width: '400px',
    }).afterClosed();
  }

}
