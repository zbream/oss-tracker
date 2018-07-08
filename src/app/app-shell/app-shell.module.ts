import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AppShellComponent } from './app-shell.component';

@NgModule({
  declarations: [
    AppShellComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [],
  providers: [],
})
export class AppShellModule {}
