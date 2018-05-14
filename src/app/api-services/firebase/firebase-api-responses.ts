import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export interface ApiResult<T = string> {
  result: T;
}

export interface ApiError {
  error: string;
}

export function parseApiError(errorResponse: HttpErrorResponse) {
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
