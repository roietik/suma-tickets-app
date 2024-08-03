import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {NotifyService} from '../notify/notify.service';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor(
    private readonly notifyService: NotifyService
  ) {
  }

  get(response: HttpErrorResponse): Observable<never> {
    this.notifyService.notifyError(response.error);
    return throwError((): Error => new Error(response.error));
  }
}
