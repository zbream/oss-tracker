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
