import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {ConfirmDialogComponent} from './confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private readonly dialog: MatDialog
  ) {

  }

  openConfirmationDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    return dialogRef.afterClosed();
  }
}