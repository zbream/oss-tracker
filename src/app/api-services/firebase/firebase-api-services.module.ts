import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { FirebaseAppConfig, FirebaseOptions } from '@firebase/app-types';

import { environment } from '../../../environments/environment';
import { IssuesApiService, ProjectsApiService } from '../interfaces';
import { FIREBASE_API } from './firebase-api.token';
import { FirebaseIssuesApiService } from './firebase-issues-api.service';
import { FirebaseProjectsApiService } from './firebase-projects-api.service';
import { getFirebaseFunctionsEndpoint } from './firebase-utils';

export const firebaseOptions: FirebaseOptions = environment.firebase.config;

export const firebaseAppConfig: FirebaseAppConfig = {
  name: environment.firebase.name,
};

const firebaseFunctions = getFirebaseFunctionsEndpoint(
  environment.firebase.config.projectId,
  environment.firebase.functionsRegion,
  environment.firebase.functionsEmulatorOrigin,
);
const firebaseApi = `${firebaseFunctions}/api`;

@NgModule({
  imports: [
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseOptions, firebaseAppConfig),
    AngularFirestoreModule,
  ],
  providers: [
    { provide: FIREBASE_API, useValue: firebaseApi },
    { provide: IssuesApiService, useClass: FirebaseIssuesApiService },
    { provide: ProjectsApiService, useClass: FirebaseProjectsApiService },
    // https://github.com/angular/angularfire2/issues/1993#issuecomment-455830987
    { provide: FirestoreSettingsToken, useValue: { } },
  ],
})
export class FirebaseApiServicesModule {

  constructor(
    private http: HttpClient,
  ) {
    // ping the server, to wake up the function
    this.http.get(`${firebaseApi}/`).subscribe();
  }

}
