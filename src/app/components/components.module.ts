import { NgModule } from '@angular/core';
import {TestApiComponent} from './test-api/test-api.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardContent} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from './user-form/user-form.component';
import {UserListComponent} from './user-list/user-list.component';
import {TicketComponent} from './ticket/ticket.component';


@NgModule({
  declarations: [
    TestApiComponent,
    ConfirmDialogComponent,
    UserFormComponent,
    UserListComponent,
    TicketComponent
  ],
  imports: [
    FormsModule,
    NgForOf,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatFabButton,
    MatCard,
    MatTable,
    MatColumnDef,
    MatCellDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatHeaderRow,
    MatCardContent,
    MatButton,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [
    TestApiComponent,
    ConfirmDialogComponent,
    UserFormComponent,
    UserListComponent,
    TicketComponent
  ]
})
export class ComponentsModule {
}