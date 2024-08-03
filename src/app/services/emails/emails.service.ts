import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API_CONFIG} from '../services.interface';
import {catchError} from 'rxjs/operators';
import {HandleErrorService} from '../handle-error/handle-error.service';

export interface SendEmail {
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly handleErrorService: HandleErrorService
  ) {
  }

  sendMail(email: string, base64: string): Observable<SendEmail> {
    return this.httpClient.post<SendEmail>(API_CONFIG.EMAILS, {
      email: email,
      ticketBase64: base64
    })
      .pipe(
        catchError((response): Observable<never> => this.handleErrorService.get(response))
      );
  }
}
