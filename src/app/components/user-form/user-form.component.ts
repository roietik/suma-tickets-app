import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User, UsersService} from '../../services/users/users.service';
import {Observable, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {TicketsService} from '../../services/tickets/tickets.service';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {
  TICKET_TITLE = "Suma Bilet 2024";
  TICKET_DESCRIPTION = 'Lorem...';

  userForm!: FormGroup;
  user!: User;
  base64!: string | null;

  private readonly destroy: Subject<void> = new Subject<void>();

  constructor(
    private readonly usersService: UsersService,
    private readonly ticketsService: TicketsService,
    private readonly http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.userForm.valueChanges
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((fields) => {
        console.log('user', this.user);
        this.user = fields;
      });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    this.getTicket()
      .pipe(
        tap((base64) => {
          this.base64 = base64;
        }),
        switchMap(() => {
          const payload = {
            ...this.user,
            ticketBase64: this.base64
          };
          return this.usersService.create(payload as User);
        }),
        switchMap(() => {
          return this.sendMailObs();
        })
      )
      .subscribe((response) => {
        console.log('response', response);
      });
  }

  private getTicket(): Observable<string | null> {
    return this.ticketsService.getTicket({
      title: this.TICKET_TITLE,
      description: this.TICKET_DESCRIPTION,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      download: true,
      base64: true
    });
  }

  private sendMailObs(): Observable<string> {
    return this.http.post<string>(`/api/emails`, {
      email: 'radoslaw.grzymala@hotmail.com',
      ticketBase64: this.base64
    });
  }

  sendMail(): void {
    this.http.post<string>(`/api/emails`, {
      email: 'radoslaw.grzymala@hotmail.com',
      ticketBase64: null
    }).subscribe((response) => {
      console.log('response', response);
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
