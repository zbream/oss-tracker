import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { firestore } from 'firebase/app';

export interface ApiResult<T = string> {
  result: T;
}

export interface ApiError {
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseResponseService {

  parseApiError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof Error) {
      // client-side error
      return throwError(errorResponse.error);
    } else {
      // server-side error
      if (errorResponse.status === 400 || errorResponse.status === 500) {
        const body = errorResponse.error as ApiError;
        return throwError(`API: ${body.error}`);
      } else {
        return throwError(errorResponse.message);
      }
    }
  }

  parseFirebaseDate(value: firestore.Timestamp | string): Date {
    if (value instanceof firestore.Timestamp) {
      return value.toDate();
    } else if (typeof value === 'string') {
      return new Date(Date.parse(value));
    } else {
      throw new Error('Unexpected date type.');
    }
  }

}
