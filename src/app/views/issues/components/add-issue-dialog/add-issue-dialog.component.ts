import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import { Issue, NewIssue } from '../../../../models/issue';
import { AddIssueDialogService } from './add-issue-dialog.service';

@Component({
  selector: 'oss-add-issue-dialog',
  templateUrl: './add-issue-dialog.component.html',
  styleUrls: ['./add-issue-dialog.component.scss'],
  providers: [
    AddIssueDialogService,
  ],
})
export class AddIssueDialogComponent implements OnInit {

  placeholder = {
    url: 'https://github.com/palantir/tslint/issues/2814',
  };

  form: FormGroup;

  newIssue$: Observable<NewIssue | undefined>;
  newIssueRetrieved$: Observable<Issue | undefined>;

  constructor(
    private dialogRef: MatDialogRef<AddIssueDialogComponent>,
    private addService: AddIssueDialogService,
  ) {
    this.form = this.addService.form;
    this.newIssue$ = this.addService.newIssue$;
    this.newIssueRetrieved$ = this.addService.newIssueRetrieved$;
    this.dialogRef.beforeClose().subscribe(() => {
      this.addService.cancel();
    });
  }

  ngOnInit() { }

  onSubmit() {
    this.addService.add();
  }

  onClose() {
    this.dialogRef.close();
  }

  onClear() {
    this.form.reset();
  }

}
