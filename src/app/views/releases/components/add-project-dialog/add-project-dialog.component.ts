import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { NewProject } from '../../../../models/project';

@Component({
  selector: 'oss-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss'],
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
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      next: new FormControl(''),
      linkUrl: new FormControl('', Validators.required),
      linkChangelog: new FormControl('', Validators.required),
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.form.valid) {
      const newProject: NewProject = {
        name: this.form.value.name,
        nextTag: this.form.value.next || undefined ,
        linkUrl: this.form.value.linkUrl,
        linkChangelog: this.form.value.linkChangelog,
      };
      this.dialogRef.close(newProject);
    }
  }

}
