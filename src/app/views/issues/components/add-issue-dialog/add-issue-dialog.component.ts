import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { NewIssue } from '../../../../models/issue';

@Component({
  selector: 'oss-add-issue-dialog',
  templateUrl: './add-issue-dialog.component.html',
  styleUrls: ['./add-issue-dialog.component.scss'],
})
export class AddIssueDialogComponent implements OnInit {

  placeholder = {
    projectName: 'angular/material2',
    issueNumber: '7172',
  };

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddIssueDialogComponent>,
  ) {
    this.form = new FormGroup({
      projectName: new FormControl('', Validators.required),
      issueNumber: new FormControl('', Validators.required),
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.form.valid) {
      const newIssue: NewIssue = {
        projectName: this.form.value.projectName,
        issueNumber: +this.form.value.issueNumber,
      };
      this.dialogRef.close(newIssue);
    }
  }

}
