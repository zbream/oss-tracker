import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ReleasesView } from './releases.view';

const ROUTES: Routes = [
  {
    path: '',
    component: ReleasesView,
  },
];

@NgModule({
  declarations: [
    ReleasesView,
  ],
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule,
  ],
  exports: [],
  providers: [],
})
export class ReleasesModule {}
