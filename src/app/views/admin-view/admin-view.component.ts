import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../services/users/users.service';

@Component({
  selector: 'admin-view',
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.scss'
})
export class AdminViewComponent implements  OnInit, OnDestroy {
  tokenId!: number;
  destroy: Subject<void> = new Subject<void>();

  constructor(
    private readonly authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getToken()
      .pipe(takeUntil(this.destroy))
      .subscribe((token) => {
        this.tokenId = token.id;
      });
  }

  private getToken(): Observable<User> {
    return this.authService.getToken();
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
