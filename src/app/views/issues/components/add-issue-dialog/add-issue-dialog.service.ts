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

  private _currentRequest?: Subscription;

  readonly form: FormGroup;

  readonly newIssue$: Observable<NewIssue | undefined>;
  readonly newIssueRetrieved$: Observable<Issue | undefined>;

  constructor(
    private _issuesApi: IssuesApiService,
    private _notification: NotificationService,
  ) {
    this.form = new FormGroup({
      url: new FormControl('', [Validators.required, Validators.pattern(URL_REGEX)]),
    });

    // provide a UI preview as URL changes
    this.newIssue$ = this.form.valueChanges.pipe(
      debounceTime(300),
      map(value => value.url as string),
      distinctUntilChanged(),
      map(url => this._validateUrl(url)),
      share(),
    );
    this.newIssueRetrieved$ = this.newIssue$.pipe(
      switchMap(newIssue => {
        if (newIssue) {
          return this._issuesApi.tryIssue(newIssue).pipe(
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

    const newIssue = this._validateUrl(this.form.value.url);
    if (!newIssue) {
      return;
    }

    if (this._currentRequest && !this._currentRequest.closed) {
      this._currentRequest.unsubscribe();
    }

    this.form.disable();
    this._currentRequest = this._issuesApi.addIssue(newIssue).subscribe({
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

  private _validateUrl(url: string): NewIssue | undefined {
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
