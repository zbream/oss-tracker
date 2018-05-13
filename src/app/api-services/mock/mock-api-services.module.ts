import { NgModule } from '@angular/core';

import { IssuesApiService, ProjectsApiService } from '../interfaces';
import { MockIssuesApiService } from './mock-issues-api.service';
import { MockProjectsApiService } from './mock-projects-api.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    { provide: IssuesApiService, useClass: MockIssuesApiService },
    { provide: ProjectsApiService, useClass: MockProjectsApiService },
  ],
})
export class MockApiServicesModule {}
