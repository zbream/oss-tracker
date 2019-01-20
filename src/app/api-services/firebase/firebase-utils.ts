import { firestore } from 'firebase/app';

export function parseFirebaseDate(value: firestore.Timestamp | string): Date {
  if (value instanceof firestore.Timestamp) {
    return value.toDate();
  } else if (typeof value === 'string') {
    return new Date(Date.parse(value));
  } else {
    throw new Error('Unexpected date type.');
  }
}

export function getFirebaseFunctionsEndpoint(projectId: string, region: string, emulatorOrigin?: string) {
  // https://github.com/firebase/firebase-js-sdk/blob/master/packages/functions/src/api/service.ts#L65
  if (emulatorOrigin) {
    const origin = emulatorOrigin;
    return `${origin}/${projectId}/${region}`;
  }
  return `https://${region}-${projectId}.cloudfunctions.net`;
}
