import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Value {
  id: number;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  constructor(private readonly http: HttpClient) { }

  configUrl = '/api';

  getValues() {
    return this.http.get<Value[]>(`${this.configUrl}/values`);
  }

  addValue(value: Value): Observable<Value[]> {
    return this.http.post<Value[]>(`${this.configUrl}/values`, { value })
      .pipe(
        catchError(err => { return this.handleError(err) })
      );
  }

  deleteValue(id: number): Observable<Value[]> {
    const url = `${this.configUrl}/values/${id}`;
    console.log('url', url);
    return this.http.delete<Value[]>(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
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