import { InjectionToken } from '@angular/core';
import { FirebaseOptions } from '@firebase/app-types';

export interface FirebaseConfig {
  config: FirebaseOptions;
  functionsRegion: string;
  functionsEmulatorOrigin?: string;
  functionsLocal?: boolean;
}

export const FIREBASE_CONFIG = new InjectionToken<FirebaseConfig>('FIREBASE_CONFIG');
