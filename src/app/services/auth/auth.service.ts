import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_CONFIG, ResponseMessage} from '../services.interface';
import {catchError} from 'rxjs/operators';
import {HandleErrorService} from '../handle-error/handle-error.service';
import {User} from '../users/users.service';

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
    private readonly handleErrorService: HandleErrorService
  ) {
  }

  login(payload: UserLogin): Observable<UserLogin> {
    return this.httpClient.post<UserLogin>(API_CONFIG.LOGIN, payload, {
      withCredentials: true
    })
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  logout(): Observable<ResponseMessage> {
    return this.httpClient.post<ResponseMessage>(API_CONFIG.LOGOUT, {})
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  getToken(): Observable<User> {
    return this.httpClient.get<User>(API_CONFIG.TOKEN, {
      withCredentials: true
    })
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }
 }
