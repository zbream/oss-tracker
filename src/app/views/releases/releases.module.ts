import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { AddProjectDialogComponent } from './components/add-project-dialog/add-project-dialog.component';
import { ProjectsTableComponent } from './components/projects-table/projects-table.component';
import { ReleasesView } from './releases.view';
import { ReleasesDialogService } from './services/releases-dialog.service';

const ROUTES: Routes = [
  {
    path: '',
    component: ReleasesView,
  },
];

@NgModule({
  declarations: [
    ReleasesView,
    ProjectsTableComponent,
    AddProjectDialogComponent,
  ],
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule,
  ],
  exports: [],
  providers: [
    ReleasesDialogService,
  ],
  entryComponents: [
    AddProjectDialogComponent,
  ],
})
export class ReleasesModule {}
