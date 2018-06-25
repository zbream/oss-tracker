import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, share, startWith, switchMap } from 'rxjs/operators';

import { IssuesApiService } from '../../../../api-services/interfaces';
import { Issue, NewIssue } from '../../../../models/issue';
import { NotificationService } from '../../../../services/notification.service';

const URL_REGEX = /^https?:\/\/github\.com\/(.+\/.+)\/issues\/([0-9]+)\/?(?:#.*)?$/;

@Injectable()
export class AddIssueDialogService {

  private currentRequest?: Subscription;

  readonly form: FormGroup;

  readonly newIssue$: Observable<NewIssue | undefined>;
  readonly newIssueRetrieved$: Observable<Issue | undefined>;

  constructor(
    private issuesApi: IssuesApiService,
    private notification: NotificationService,
  ) {
    this.form = new FormGroup({
      url: new FormControl('', [Validators.required, Validators.pattern(URL_REGEX)]),
    });

    // provide a UI preview as URL changes
    this.newIssue$ = this.form.valueChanges.pipe(
      debounceTime(300),
      map(value => value.url as string),
      distinctUntilChanged(),
      map(url => this.validateUrl(url)),
      share(),
    );
    this.newIssueRetrieved$ = this.newIssue$.pipe(
      switchMap(newIssue => {
        if (newIssue) {
          return this.issuesApi.tryIssue(newIssue).pipe(
            startWith(undefined as any),
            catchError(() => of(undefined)),
          );
        } else {
          return of(undefined);
        }
      }),
      share(),
    );
  }

  add() {
    if (!this.form.valid) {
      return;
    }

    const newIssue = this.validateUrl(this.form.value.url);
    if (!newIssue) {
      return;
    }

    if (this.currentRequest && !this.currentRequest.closed) {
      this.currentRequest.unsubscribe();
    }

    this.form.disable();
    this.currentRequest = this.issuesApi.addIssue(newIssue).subscribe({
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

  private validateUrl(url: string): NewIssue | undefined {
    const split = URL_REGEX.exec(url);
    if (split) {
      return {
        projectName: split[1],
        issueNumber: +split[2],
      };
    } else {
      return undefined;
    }
  }

}
