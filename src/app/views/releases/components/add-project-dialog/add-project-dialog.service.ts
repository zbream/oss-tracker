import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ProjectsApiService } from '../../../../api-services/interfaces';
import { NewProject } from '../../../../models/project';
import { NotificationService } from '../../../../services/notification.service';

@Injectable()
export class AddProjectDialogService {

  private _currentRequest?: Subscription;

  readonly form: FormGroup;

  constructor(
    private _projectsApi: ProjectsApiService,
    private _notification: NotificationService,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      next: new FormControl(''),
      linkUrl: new FormControl('', Validators.required),
      linkChangelog: new FormControl('', Validators.required),
    });
  }

  add() {
    if (!this.form.valid) {
      return;
    }

    const newProject: NewProject = {
      name: this.form.value.name,
      nextTag: this.form.value.next || undefined ,
      linkUrl: this.form.value.linkUrl,
      linkChangelog: this.form.value.linkChangelog,
    };

    if (this._currentRequest && !this._currentRequest.closed) {
      this._currentRequest.unsubscribe();
    }

    this.form.disable();
    this._currentRequest = this._projectsApi.addProject(newProject).subscribe({
      next: message => {
        this.form.enable();
        this._notification.show(message);
      },
      error: err => {
        this.form.enable();
        this._notification.show(err);
      },
    });
  }

  cancel() {
    if (this._currentRequest && !this._currentRequest.closed) {
      this._currentRequest.unsubscribe();
      this._currentRequest = undefined;
    }
    this.form.enable();
  }

}
