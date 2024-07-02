import {Component, OnInit} from '@angular/core';
import {User, UsersService} from '../../services/users/users.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users!: User[];

  constructor(
    private readonly usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.usersService.getAll()
      .subscribe((users): void => {
        this.users = users;
      });
  }

  removeUser(id: number): void {
    this.usersService.remove(id);
  }
}
