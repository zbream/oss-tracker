import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, share, startWith, switchMap } from 'rxjs/operators';

import { IssuesApiService } from '../../../../api-services/interfaces';
import { Issue, NewIssue } from '../../../../models/issue';

const URL_REGEX = /^https?:\/\/github\.com\/(.+)\/issues\/([0-9]+)\/?$/;

@Component({
  selector: 'oss-add-issue-dialog',
  templateUrl: './add-issue-dialog.component.html',
  styleUrls: ['./add-issue-dialog.component.scss'],
})
export class AddIssueDialogComponent implements OnInit {

  placeholder = {
    url: 'https://github.com/palantir/tslint/issues/2814',
  };

  form: FormGroup;

  newIssue$: Observable<NewIssue | undefined>;
  issue$: Observable<Issue | undefined>;

  constructor(
    private issuesApi: IssuesApiService,
    private dialogRef: MatDialogRef<AddIssueDialogComponent>,
  ) {
    this.form = new FormGroup({
      url: new  FormControl('', [Validators.required, Validators.pattern(URL_REGEX)]),
    });

    // provide a UI preview as URL changes
    this.newIssue$ = this.form.valueChanges.pipe(
      debounceTime(300),
      map(value => this.validateUrl(value.url)),
      share(),
    );
    this.issue$ = this.newIssue$.pipe(
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

  ngOnInit() { }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const newIssue = this.validateUrl(this.form.value.url);
    if (!newIssue) {
      return;
    }
    this.dialogRef.close(newIssue);
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
