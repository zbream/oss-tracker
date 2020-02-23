import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const DEFAULT_ROUTE = '/issues';

const ROUTES: Routes = [
  {
    path: '', pathMatch: 'full',
    redirectTo: DEFAULT_ROUTE,
  },
  {
    path: 'issues',
    loadChildren: () => import('./views/issues/issues.module').then(m => m.IssuesModule),
  },
  {
    path: 'releases',
    loadChildren: () => import('./views/releases/releases.module').then(m => m.ReleasesModule),
  },
  {
    path: '**',
    redirectTo: DEFAULT_ROUTE,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
