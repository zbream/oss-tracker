import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const DURATION = 4000;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(
    private snackbar: MatSnackBar,
  ) {}

  show(message: string) {
    this.snackbar.open(message, undefined, {
      duration: DURATION,
    });
  }

}
