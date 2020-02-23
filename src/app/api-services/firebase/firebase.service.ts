import { Inject, Injectable } from '@angular/core';

import { app, initializeApp } from 'firebase/app';
import 'firebase/firestore';

import { HttpClient } from '@angular/common/http';
import { FIREBASE_CONFIG, FirebaseConfig } from './firebase-config';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  readonly app: app.App;
  readonly api: string;

  constructor(
    private _http: HttpClient,
    @Inject(FIREBASE_CONFIG) private _config: FirebaseConfig,
  ) {
    this.app = initializeApp(this._config.config);

    if (_config.functionsLocal) {
      this.api = 'api';
    } else {
      const functionsEndpoint = this._getFirebaseFunctionsEndpoint(
        this._config.config.projectId!,
        this._config.functionsRegion,
        this._config.functionsEmulatorOrigin,
      );
      this.api = `${functionsEndpoint}/api`;
    }

    this.wakeup();
  }

  wakeup() {
    this._http.get(`${this.api}/`).subscribe();
  }

  private _getFirebaseFunctionsEndpoint(projectId: string, region: string, emulatorOrigin?: string) {
    // https://github.com/firebase/firebase-js-sdk/blob/firebase%407.8.2/packages/functions/src/api/service.ts#L113-L121
    if (emulatorOrigin) {
      const origin = emulatorOrigin;
      return `${origin}/${projectId}/${region}`;
    }
    return `https://${region}-${projectId}.cloudfunctions.net`;
  }

}
