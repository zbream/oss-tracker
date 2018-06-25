import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ProjectsApiService } from '../../../../api-services/interfaces';
import { NewProject } from '../../../../models/project';
import { NotificationService } from '../../../../services/notification.service';

@Injectable()
export class AddProjectDialogService {

  private currentRequest?: Subscription;

  readonly form: FormGroup;

  constructor(
    private projectsApi: ProjectsApiService,
    private notification: NotificationService,
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

    if (this.currentRequest && !this.currentRequest.closed) {
      this.currentRequest.unsubscribe();
    }

    this.form.disable();
    this.currentRequest = this.projectsApi.addProject(newProject).subscribe({
      next: message => {
        this.form.enable();
        this.notification.show(message);
      },
      error: err => {
        this.form.enable();
        this.notification.show(err);
      },
    });
  }

  cancel() {
    if (this.currentRequest && !this.currentRequest.closed) {
      this.currentRequest.unsubscribe();
      this.currentRequest = undefined;
    }
    this.form.enable();
  }

}
