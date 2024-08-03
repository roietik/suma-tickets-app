import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, of} from 'rxjs';
import {API_CONFIG, ResponseMessage} from '../services.interface';
import {catchError} from 'rxjs/operators';
import {HandleErrorService} from '../handle-error/handle-error.service';
import {User} from '../users/users.service';
import {Router} from '@angular/router';

export interface UserLogin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly handleErrorService: HandleErrorService,
    private readonly router: Router
  ) {
  }

  login(payload: UserLogin): Observable<UserLogin> {
    return this.httpClient.post<UserLogin>(API_CONFIG.LOGIN, payload, {
      withCredentials: true
    })
      .pipe(
        catchError((response): Observable<never> => this.handleErrorService.get(response))
      );
  }

  logout(): Observable<ResponseMessage> {
    return this.httpClient.post<ResponseMessage>(API_CONFIG.LOGOUT, {})
      .pipe(
        catchError((response): Observable<never> => this.handleErrorService.get(response))
      );
  }

  getToken(): Observable<boolean> {
    return this.httpClient.get<User>(API_CONFIG.TOKEN, {
      withCredentials: true
    })
      .pipe(
        catchError((error): Observable<null> => {
          if (error.status === 404 || error.status === 401) {
            this.router.navigate(['./login']);
            return of(null);
          }
          this.handleErrorService.get(error);
          throw Error(error);
        }),
        map((token): boolean => !!token)
      );
  }
}
