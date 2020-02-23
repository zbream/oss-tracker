import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { environment } from '../../../environments/environment';
import { IssuesApiService, ProjectsApiService } from '../interfaces';
import { FIREBASE_CONFIG } from './firebase-config';
import { FirebaseIssuesApiService } from './firebase-issues-api.service';
import { FirebaseProjectsApiService } from './firebase-projects-api.service';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    { provide: FIREBASE_CONFIG, useValue: environment.firebase },
    { provide: IssuesApiService, useClass: FirebaseIssuesApiService },
    { provide: ProjectsApiService, useClass: FirebaseProjectsApiService },
  ],
})
export class FirebaseApiServicesModule {}
