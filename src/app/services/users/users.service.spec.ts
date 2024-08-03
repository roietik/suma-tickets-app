import { TestBed } from '@angular/core/testing';
import {User, UsersService} from './users.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {Observable} from 'rxjs';
import {API_CONFIG, BaseGiven} from '../services.interface';

interface When {
  getAll: () => Observable<User[]>;
  create: () => Observable<User>;
  isEmailExist: (email: string) => Observable<boolean>;
}

interface Then {
  expectUrl: (expectedUrl: string, type: string) => TestRequest;
}

type Given = BaseGiven<When, Then>;

const IsEmailExistResponse = true;

const userResponse: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  ticketBase64: 'base64'
};

const usersResponse: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    ticketBase64: 'base64'
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe2@gmail.com',
    ticketBase64: 'base64'
  }
];

describe('UsersService', (): void => {
  const given = async (response: User[] | User | boolean): Promise<Given> => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ UsersService ]
    });

    return {
      when: {
        getAll: (): Observable<User[]> => TestBed.inject(UsersService).getAll(),
        create: (): Observable<User> => TestBed.inject(UsersService).create({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@gmail.com',
            ticketBase64: 'base64'
          }),
        isEmailExist: (email: string): Observable<boolean> => TestBed.inject(UsersService).isEmailExist(email),
      },
      then: {
        expectUrl: (expectedUrl: string, type: string): TestRequest => {
          const httpTestingController = TestBed.inject(HttpTestingController);
          const req = httpTestingController.expectOne(expectedUrl);
          expect(req.request.method).toEqual(type);
          req.flush(response);
          httpTestingController.verify();

          return req;
        }
      }
    };
  };

  it('should return users list', async (): Promise<void> => {
    const {when, then} = await given(usersResponse);

    when.getAll().subscribe((users): void => {
      expect(users).toEqual(usersResponse);
    });

    const req = then.expectUrl(API_CONFIG.USERS, 'GET');
    expect(req.request.method).toEqual('GET');
  });

  it('after created should return user', async (): Promise<void> => {
    const {when, then} = await given(userResponse);

    when.create().subscribe((user): void => {
      expect(user).toEqual(userResponse);
    });

    const req = then.expectUrl(API_CONFIG.USERS, 'POST');
    expect(req.request.method).toEqual('POST');
  });

  it('is email exist', async (): Promise<void> => {
    const {when, then} = await given(IsEmailExistResponse);

    when.isEmailExist('johndoe@gmail.com').subscribe((isEmailExist): void => {
      expect(isEmailExist).toEqual(true);
    });

    const req = then.expectUrl(`${API_CONFIG.USERS}/is-email-exist`, 'POST');
    expect(req.request.method).toEqual('POST');
  });
});
