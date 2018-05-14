import { NgModule } from '@angular/core';

import { MockApiServicesModule } from '../api-services/mock/mock-api-services.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    MockApiServicesModule,
  ],
  exports: [
    SharedModule,
  ],
  providers: [],
})
export class CoreModule {}
