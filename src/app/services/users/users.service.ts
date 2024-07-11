import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_CONFIG} from '../services.interface';
import {catchError} from 'rxjs/operators';
import {HandleErrorService} from '../handle-error/handle-error.service';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  ticketBase64: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly handleErrorService: HandleErrorService
  ) {
  }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(API_CONFIG.USERS)
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  create(user: User): Observable<User> {
    return this.httpClient.post<User>(API_CONFIG.USERS, { ...user })
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  remove(id: number): void {
    this.httpClient.delete<User[]>(`${API_CONFIG.USERS}/${id}`)
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      )
      .subscribe();
  }

  isEmailExist(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${API_CONFIG.USERS}/is-email-exist`, {
      email: email
    })
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }
}