import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';
import { FirebaseApiServicesModule } from '../api-services/firebase/firebase-api-services.module';
import { MockApiServicesModule } from '../api-services/mock/mock-api-services.module';
import { SharedModule } from '../shared/shared.module';

const API_SERVICES = environment.useMocks ? MockApiServicesModule : FirebaseApiServicesModule;

@NgModule({
  declarations: [],
  imports: [
    API_SERVICES,
  ],
  exports: [
    SharedModule,
  ],
  providers: [],
})
export class CoreModule {}
