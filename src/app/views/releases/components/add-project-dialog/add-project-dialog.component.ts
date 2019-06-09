import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { AddProjectDialogService } from './add-project-dialog.service';

@Component({
  selector: 'oss-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss'],
  providers: [
    AddProjectDialogService,
  ],
})
export class AddProjectDialogComponent implements OnInit {

  placeholder = {
    name: '@angular/cli',
    next: 'next',
    linkUrl: 'https://github.com/angular/angular',
    linkChangelog: 'https://github.com/angular/angular/blob/master/CHANGELOG.md',
  };

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddProjectDialogComponent>,
    private addService: AddProjectDialogService,
  ) {
    this.form = this.addService.form;
    this.dialogRef.beforeClosed().subscribe(() => {
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
