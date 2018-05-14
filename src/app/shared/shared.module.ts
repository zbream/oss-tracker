import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { CommandBarComponent } from './components/command-bar/command-bar.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    CommandBarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    CommandBarComponent,
  ],
  providers: [],
})
export class SharedModule {}
