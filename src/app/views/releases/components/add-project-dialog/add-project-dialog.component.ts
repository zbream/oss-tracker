import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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
    private _dialogRef: MatDialogRef<AddProjectDialogComponent>,
    private _addService: AddProjectDialogService,
  ) {
    this.form = this._addService.form;
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
