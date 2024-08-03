import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {User, UsersService} from '../../services/users/users.service';
import {forkJoin, Observable, of, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {TicketsService} from '../../services/tickets/tickets.service';
import {EmailsService, SendEmail} from '../../services/emails/emails.service';
import {NotifyService} from '../../services/notify/notify.service';
import {RecaptchaErrorParameters} from 'ng-recaptcha';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {

  TICKET_TITLE = 'Suma Bilet 2024';
  TICKET_DESCRIPTION = '';

  userForm!: FormGroup;
  user!: User;
  base64!: string;
  isTicketsLimit = false;
  isTicketsSoldOut = false;
  isCaptcha!: boolean;

  private readonly destroy: Subject<void> = new Subject<void>();

  constructor(
    private readonly usersService: UsersService,
    private readonly ticketsService: TicketsService,
    private readonly emailsService: EmailsService,
    private readonly notifyService: NotifyService,
  ) {
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      statute: new FormControl('', Validators.required)
    });

    this.userForm.valueChanges
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((response): void => {
        const fields = response;
        delete fields.statute;
        this.user = fields;
      });

    forkJoin([
      this.ticketsService.getTicketsCount(),
      this.ticketsService.getTicketsLimit(),
      this.ticketsService.getTicketsSoldOut()
    ])
      .pipe(takeUntil(this.destroy))
      .subscribe(([ticketsCount, ticketsLimit, ticketsSoldOut]): void => {
        this.ticketGenerationAvailability(ticketsCount, ticketsLimit, ticketsSoldOut);
      });
  }

  private ticketGenerationAvailability(ticketsCount: number, ticketsLimit: number, ticketsSoldOut: boolean): void {
    this.isTicketsLimit = ticketsCount >= ticketsLimit;
    this.isTicketsSoldOut = ticketsSoldOut;
    this.updateFormState(this.isTicketsLimit, this.isTicketsSoldOut);
  }

  private updateFormState(isTicketsLimit: boolean, isTicketsSoldOut: boolean): void {
    if (isTicketsLimit || isTicketsSoldOut) {
      this.userForm.controls['firstName'].disable();
      this.userForm.controls['lastName'].disable();
      this.userForm.controls['email'].disable();
      this.userForm.controls['statute'].disable();
      return;
    }
    this.userForm.controls['firstName'].enable();
    this.userForm.controls['lastName'].enable();
    this.userForm.controls['email'].enable();
    this.userForm.controls['statute'].enable();
  }

  onSubmit(formDirective: FormGroupDirective): void {
    if (this.userForm.invalid) {
      return;
    }

    this.usersService.isEmailExist(this.user.email)
      .pipe(
        switchMap((isEmailExist): Observable<null> | Observable<string> => {
          if (isEmailExist) {
            return of(null);
          }
          return this.getTicket();
        }),
        tap((base64): void => {
          if (!base64) {
            return;
          }
          this.base64 = base64;
        }),
        switchMap((): Observable<User> => {
          const payload: User = {
            ...this.user,
            ticketBase64: this.base64
          };
          return this.usersService.create(payload);
        }),
        switchMap((): Observable<SendEmail> => {
          return this.sendMail(this.user.email, this.base64);
        }),
        takeUntil(this.destroy)
      )
      .subscribe((response): void => {
        this.notifyService.notifySuccess(response.message);
        formDirective.resetForm();
      });
  }

  private getTicket(): Observable<string> {
    return <Observable<string>>this.ticketsService.getTicket({
      title: this.TICKET_TITLE,
      description: this.TICKET_DESCRIPTION,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      download: true,
      base64: true
    });
  }

  private sendMail(email: string, base64: string): Observable<SendEmail> {
    return this.emailsService.sendMail(email, base64);
  }

  captchaResolved(captchaResponse: string | null): void {
    this.isCaptcha = !!(captchaResponse && captchaResponse.length > 0);
  }

  captchaError(errorDetails: RecaptchaErrorParameters): void {
    throw new Error(`reCAPTCHA error encountered; details: ${errorDetails}`);
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
