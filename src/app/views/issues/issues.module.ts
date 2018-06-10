import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { AddIssueDialogComponent } from './components/add-issue-dialog/add-issue-dialog.component';
import { IssuesTableComponent } from './components/issues-table/issues-table.component';
import { IssuesView } from './issues.view';
import { IssuesDialogService } from './services/issues-dialog.service';

const ROUTES: Routes = [
  {
    path: '',
    component: IssuesView,
  },
];

@NgModule({
  declarations: [
    IssuesView,
    IssuesTableComponent,
    AddIssueDialogComponent,
  ],
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule,
  ],
  exports: [],
  providers: [
    IssuesDialogService,
  ],
  entryComponents: [
    AddIssueDialogComponent,
  ],
})
export class IssuesModule {}
