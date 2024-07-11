import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private readonly matSnackBar: MatSnackBar
  ) {
  }
  notifyError(message: string, duration = false): void {
    this.matSnackBar.open(message, 'Zamknij', {
      panelClass: ['notify-error'],
      duration: duration ? 3000 : undefined
    });
  }

  notifySuccess(message: string, duration = false): void {
    this.matSnackBar.open(message, 'Zamknij', {
      panelClass: ['notify-success'],
      duration: duration ? 3000 : undefined
    });
  }
}
