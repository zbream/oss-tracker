import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { Issue, NewIssue } from '../../../../models/issue';
import { ADD_ISSUE_DIALOG_ANIMATIONS } from './add-issue-dialog.animations';
import { AddIssueDialogService } from './add-issue-dialog.service';

@Component({
  selector: 'oss-add-issue-dialog',
  templateUrl: './add-issue-dialog.component.html',
  styleUrls: ['./add-issue-dialog.component.scss'],
  providers: [
    AddIssueDialogService,
  ],
  animations: ADD_ISSUE_DIALOG_ANIMATIONS,
})
export class AddIssueDialogComponent implements OnInit {

  placeholder = {
    url: 'https://github.com/palantir/tslint/issues/2814',
  };

  form: FormGroup;

  newIssue$: Observable<NewIssue | undefined>;
  newIssueRetrieved$: Observable<Issue | undefined>;

  constructor(
    private _dialogRef: MatDialogRef<AddIssueDialogComponent>,
    private _addService: AddIssueDialogService,
  ) {
    this.form = this._addService.form;
    this.newIssue$ = this._addService.newIssue$;
    this.newIssueRetrieved$ = this._addService.newIssueRetrieved$;
    this._dialogRef.beforeClosed().subscribe(() => {
      this._addService.cancel();
    });
  }

  ngOnInit() { }

  onSubmit() {
    this._addService.add();
  }

  onClose() {
    this._dialogRef.close();
  }

  onClear() {
    this.form.reset();
  }

}
