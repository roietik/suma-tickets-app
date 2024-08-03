import {Observable, of} from 'rxjs';
import {TicketsService} from '../../services/tickets/tickets.service';
import {UserFormComponent} from './user-form.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroupDirective, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ComponentsModule} from '../components.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {User, UsersService} from '../../services/users/users.service';
import {EmailsService, SendEmail} from '../../services/emails/emails.service';
import {NotifyService} from '../../services/notify/notify.service';
import {By} from '@angular/platform-browser';
import Spy = jasmine.Spy;

const userFormResponse = {
  getTicketsLimit: 3000,
  getTicketsCount: 30,
  getTicketsSoldOut: false,
  create: {firstName: 'Jan', lastName: 'Kowalski', email: 'jankowalski@gmail.com', ticketBase64: 'base64', id: 1},
  isEmailExist: true,
  sendMail: {message: 'Success'}
};

describe('UserFormComponent',(): void => {
  const given = async (data: {
    getTicketsLimit: number,
    getTicketsCount: number,
    getTicketsSoldOut: boolean,
    create: User,
    isEmailExist: boolean,
    sendMail: SendEmail
  }): Promise<{
    componentInstance: UserFormComponent,
    fixture: ComponentFixture<UserFormComponent>,
    isEmailExistSpy: Spy<(email: string) => Observable<boolean>>,
    notifySuccessSpy: Spy<(message: string, duration?: boolean) => void>
  }> => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        ComponentsModule,
        BrowserAnimationsModule
      ],
      declarations: [UserFormComponent],
      providers: [
        {
          provide: TicketsService,
          useValue: {
            getTicketsLimit: (): Observable<number> => of(data.getTicketsLimit),
            getTicketsCount: (): Observable<number> => of(data.getTicketsCount),
            getTicketsSoldOut: (): Observable<boolean> => of(data.getTicketsSoldOut)
          }
        },
        {
          provide: UsersService,
          useValue: {
            create: (): Observable<User> => of(data.create),
            isEmailExist: (): Observable<boolean> => of(data.isEmailExist)
          }
        },
        {
          provide: EmailsService,
          useValue: {
            sendMail: (): Observable<SendEmail> => of(data.sendMail)
          }
        },
        {
          provide: NotifyService
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(UserFormComponent);
    const componentInstance = fixture.componentInstance;

    const isEmailExistSpy = spyOn(TestBed.inject(UsersService), 'isEmailExist');
    isEmailExistSpy.and.returnValue(of(true));
    const notifySuccessSpy = spyOn(TestBed.inject(NotifyService), 'notifySuccess');

    fixture.detectChanges();

    return {
      componentInstance: componentInstance,
      fixture: fixture,
      isEmailExistSpy: isEmailExistSpy,
      notifySuccessSpy: notifySuccessSpy
    };
  };

  it('should isTicketsLimit and isTicketsSoldOut set correctly', async (): Promise<void> => {
    const {componentInstance} = await given({
      ...userFormResponse,
      getTicketsSoldOut: true
    });

    expect(componentInstance.isTicketsLimit).toEqual(false);
    expect(componentInstance.isTicketsSoldOut).toEqual(true);
  });

  it('should required fields disable if is tickets limit or is tickets sold out', async (): Promise<void> => {
    const { componentInstance } = await given({
      ...userFormResponse,
      getTicketsLimit: 3000,
      getTicketsCount: 3001,
      getTicketsSoldOut: true,
    });
    const { firstName, lastName, email, statute } = componentInstance.userForm.controls;
    expect(firstName.disabled).toBeTrue();
    expect(lastName.disabled).toBeTrue();
    expect(email.disabled).toBeTrue();
    expect(statute.disabled).toBeTrue();
  });

  it('should not submit if the form is invalid', async (): Promise<void> => {
    const { componentInstance, fixture } = await given({
      ...userFormResponse,
    });

    componentInstance.userForm.patchValue({
      firstName: null,
      lastName: null,
      email: null,
      statute: null
    });
    const formDirective = fixture.debugElement.query(By.directive(FormGroupDirective)).injector.get(FormGroupDirective);
    componentInstance.onSubmit(formDirective);
    expect(componentInstance.userForm.invalid).toBeTrue();
  });

  it('should clear the form after successful submission', async (): Promise<void> => {
    const { componentInstance, fixture, isEmailExistSpy, notifySuccessSpy } = await given({
      ...userFormResponse
    });

    componentInstance.userForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      statute: true
    });
    expect(componentInstance.userForm.valid).toBeTrue();

    const formDirective = fixture.debugElement.query(By.directive(FormGroupDirective)).injector.get(FormGroupDirective);
    await componentInstance.onSubmit(formDirective);
    expect(isEmailExistSpy).toHaveBeenCalledTimes(1);
    expect(notifySuccessSpy).toHaveBeenCalledTimes(1);
    expect(componentInstance.userForm.pristine).toBeTrue();
  });

  it('should mark email field as invalid if email is incorrect', async (): Promise<void> => {
    const { componentInstance } = await given({
      ...userFormResponse,
    });
    const email = componentInstance.userForm.controls['email'];
    email.setValue('invalid_email');
    expect(email.invalid).toBeTrue();
  });

  it('should not display alert when isTicketsSoldOut is false', async (): Promise<void> => {
    const {componentInstance, fixture } = await given({
      ...userFormResponse,
    });
    componentInstance.isTicketsSoldOut = false;

    const alertElement = fixture.debugElement.query(By.css('[data-selector="alert-ticket-sold-out"]'));
    expect(alertElement).toBeNull();
  });

  it('should display alert when isTicketsSoldOut is true', async (): Promise<void> => {
    const {componentInstance, fixture } = await given({
      ...userFormResponse,
    });
    componentInstance.isTicketsSoldOut = true;
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('[data-selector="alert-ticket-sold-out"]'));
    expect(alertElement).not.toBeNull();
  });

  it('should not display alert when isTicketsLimit is false', async (): Promise<void> => {
    const {componentInstance, fixture } = await given({
      ...userFormResponse,
    });
    componentInstance.isTicketsSoldOut = false;

    const alertElement = fixture.debugElement.query(By.css('[data-selector="alert-tickets-limit"]'));
    expect(alertElement).toBeNull();
  });

  it('should display alert when isTicketsLimit is true', async (): Promise<void> => {
    const {componentInstance, fixture } = await given({
      ...userFormResponse,
    });
    componentInstance.isTicketsLimit = true;
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('[data-selector="alert-tickets-limit"]'));
    expect(alertElement).not.toBeNull();
  });
});
