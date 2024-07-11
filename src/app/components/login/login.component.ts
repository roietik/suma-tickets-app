import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {AuthService, UserLogin} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  user!: UserLogin

  destroy: Subject<void> = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });

    this.loginForm.valueChanges
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((fields) => {
        this.user = fields;
      });
  }

  onSubmit(): void {
    this.authService.login(this.user)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.router.navigate(['./admin'])
      })
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
