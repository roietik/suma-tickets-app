import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {NotifyService} from '../notify/notify.service';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor(
    private readonly notifyService: NotifyService
  ) {
  }

  get(response: HttpErrorResponse) {
    console.log('err', response);
    this.notifyService.notifyError(response.error);
    return throwError(() => new Error(response.error));
  }
}
