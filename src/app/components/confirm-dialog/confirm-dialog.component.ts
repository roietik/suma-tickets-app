import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}

  closeDialog(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}