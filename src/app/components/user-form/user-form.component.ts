import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User, UsersService} from '../../services/users/users.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  user!: User;
  private readonly destroy:Subject<void> = new Subject<void>();

  constructor(
    private readonly usersService: UsersService
  ) {
  }


  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const payload = {
      ...this.userForm.value,
      ticketBase64: this.generateTicket()
    }
    console.log('payload', payload);
    this.usersService.create(payload).subscribe();
  }

  generateTicket(): string {
    return 'base 64 example'
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
