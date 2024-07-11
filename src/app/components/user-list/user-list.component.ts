import {Component, OnDestroy, OnInit} from '@angular/core';
import {User, UsersService} from '../../services/users/users.service';
import {ConfirmDialogService} from '../confirm-dialog/confirm-dialog.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {
  users!: User[];

  destroy: Subject<void> = new Subject<void>();

  constructor(
    private readonly usersService: UsersService,
    private readonly confirmDialogService: ConfirmDialogService
  ) {
  }

  ngOnInit(): void {
    this.usersService.getAll()
      .subscribe((users): void => {
        this.users = users;
      });
  }

  removeUser(id: number): void {
    this.confirmDialogService.openConfirmationDialog()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.usersService.remove(id);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
