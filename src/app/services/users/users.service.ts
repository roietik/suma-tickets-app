import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  ticketBase64: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private readonly http: HttpClient
  ) { }
  USERS_ROUTE = '/users';
  CONFIG_URL = '/api';

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.CONFIG_URL}${this.USERS_ROUTE}`)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  create(user: User): Observable<User[]> {
    return this.http.post<User[]>(`${this.CONFIG_URL}${this.USERS_ROUTE}`, { ...user })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  remove(id: number): void {
    const url = `${this.CONFIG_URL}${this.USERS_ROUTE}/${id}`;
    this.http.delete<User[]>(url)
      .pipe(
        catchError(err => this.handleError(err))
      ).subscribe();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}