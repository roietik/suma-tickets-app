import {Component, OnDestroy} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Subject, takeUntil} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss'
})
export class TopMenuComponent implements OnDestroy {
  destroy: Subject<void> = new Subject<void>();
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  logout(): void {
    this.authService.logout()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.router.navigate(['./login'])
      })
  }

  ngOnDestroy(): void {
  }
}
