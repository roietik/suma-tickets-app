import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private loginUrl = '/auth/login';
  constructor(
    private readonly _http: HttpClient
  ) {

  }
  Login(user: string, password: string): Observable<any> {
    return this._http.post(this.loginUrl, { user, password })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}