import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatTabsModule,
  MatToolbarModule,
} from '@angular/material';

@NgModule({
  exports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatToolbarModule,
  ],
})
export class MaterialModule {}
