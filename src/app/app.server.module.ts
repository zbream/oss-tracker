import { NgModule } from '@angular/core';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { ServerModule } from '@angular/platform-server';
import { Router, RouterModule, Routes } from '@angular/router';

import { AppShellComponent } from './app-shell/app-shell.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

const routes: Routes = [ { path: 'app-shell-path', component: AppShellComponent }];

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    RouterModule.forRoot(routes),
    FlexLayoutServerModule,
    AppShellModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(router: Router) {
    router.resetConfig(routes);
  }
}
