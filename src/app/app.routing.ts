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
    loadChildren: './views/issues/issues.module#IssuesModule',
  },
  {
    path: 'releases',
    loadChildren: './views/releases/releases.module#ReleasesModule',
  },
  {
    path: '**',
    redirectTo: DEFAULT_ROUTE,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
