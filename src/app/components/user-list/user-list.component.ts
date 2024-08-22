import {Component, OnDestroy, OnInit} from '@angular/core';
import {User, UsersService} from '../../services/users/users.service';
import {ConfirmDialogService} from '../confirm-dialog/confirm-dialog.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit, OnDestroy {
  users!: User[];
  totalItems!: number;
  totalPages!: number;
  currentPage!: number;

  private readonly destroy: Subject<void> = new Subject<void>();

  constructor(
    private readonly usersService: UsersService,
    private readonly confirmDialogService: ConfirmDialogService
  ) {
  }

  ngOnInit(): void {
    this.usersService.getAll()
      .subscribe(({collection, totalItems, totalPages, currentPage}): void => {
        this.users = collection;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
      });
  }

  removeUser(id: number): void {
    this.confirmDialogService.openConfirmationDialog()
      .pipe(takeUntil(this.destroy))
      .subscribe((): void => {
        this.usersService.remove(id);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
