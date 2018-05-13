import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  providers: [],
})
export class SharedModule {}
