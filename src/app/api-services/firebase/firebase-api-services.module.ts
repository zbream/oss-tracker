import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FirebaseAppConfig, FirebaseOptions } from '@firebase/app-types';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { IssuesApiService, ProjectsApiService } from '../interfaces';
import { FIREBASE_API } from './firebase-api.token';
import { FirebaseIssuesApiService } from './firebase-issues-api.service';
import { FirebaseProjectsApiService } from './firebase-projects-api.service';

const API = 'https://us-central1-oss-tracker-53e81.cloudfunctions.net/api';
// const API = 'http://localhost:5000/oss-tracker-53e81/us-central1/api';

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
    AngularFireModule.initializeApp(FIREBASE_OPTIONS, FIREBASE_APP_CONFIG),
    AngularFirestoreModule,
  ],
  providers: [
    { provide: FIREBASE_API, useValue: API },
    { provide: IssuesApiService, useClass: FirebaseIssuesApiService },
    { provide: ProjectsApiService, useClass: FirebaseProjectsApiService },
  ],
})
export class FirebaseApiServicesModule {}
