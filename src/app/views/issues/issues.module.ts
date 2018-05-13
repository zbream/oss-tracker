import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { IssuesView } from './issues.view';

const ROUTES: Routes = [
  {
    path: '',
    component: IssuesView,
  },
];

@NgModule({
  declarations: [
    IssuesView,
  ],
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule,
  ],
  exports: [],
  providers: [],
})
export class IssuesModule {}
