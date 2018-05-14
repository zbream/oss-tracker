import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FirebaseAppConfig, FirebaseOptions } from '@firebase/app-types';
import { AngularFireModule, FirebaseAppConfigToken, FirebaseOptionsToken } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { IssuesApiService, ProjectsApiService } from '../interfaces';
import { FIREBASE_API } from './firebase-api.token';
import { FirebaseIssuesApiService } from './firebase-issues-api.service';
import { FirebaseProjectsApiService } from './firebase-projects-api.service';

const API = 'https://us-central1-oss-tracker-53e81.cloudfunctions.net/apiDev';
// const API = 'http://localhost:5000/oss-tracker-53e81/us-central1/apiDev';

const FIREBASE_OPTIONS: FirebaseOptions = {
  apiKey: 'AIzaSyDsx_yuwiINtdyUbijJlORSpVeUS4Zk-30',
  authDomain: 'oss-tracker-53e81.firebaseapp.com',
  databaseURL: 'https://oss-tracker-53e81.firebaseio.com',
  projectId: 'oss-tracker-53e81',
  storageBucket: 'oss-tracker-53e81.appspot.com',
  messagingSenderId: '682609695066',
};

const FIREBASE_APP_CONFIG: FirebaseAppConfig = {
  name: 'oss-tracker-angular',
};

@NgModule({
  imports: [
    HttpClientModule,
    // TODO: remove workaround https://github.com/angular/angularfire2/issues/1635
    // AngularFireModule.initializeApp(OPTIONS, APP_CONFIG),
    AngularFireModule,
    AngularFirestoreModule,
  ],
  providers: [
    { provide: FIREBASE_API, useValue: API },
    { provide: IssuesApiService, useClass: FirebaseIssuesApiService },
    { provide: ProjectsApiService, useClass: FirebaseProjectsApiService },
    // TODO: remove workaround https://github.com/angular/angularfire2/issues/1635
    { provide: FirebaseOptionsToken, useValue: FIREBASE_OPTIONS },
    { provide: FirebaseAppConfigToken, useValue: FIREBASE_APP_CONFIG },
  ],
})
export class FirebaseApiServicesModule {}
