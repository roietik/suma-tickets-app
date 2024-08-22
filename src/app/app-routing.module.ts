import {inject, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminViewComponent} from './views/admin-view/admin-view.component';
import {TicketViewComponent} from './views/ticket-view/ticket-view.component';
import {LoginComponent} from './components/login/login.component';
import {AuthService} from './services/auth/auth.service';
import {Observable} from 'rxjs';
import {UsersViewComponent} from './views/users-view/users-view.component';
import {AdminComponent} from './components/admin/admin.component';


export const routes: Routes = [
  { path: 'admin',
    title: 'Admin',
    component: AdminViewComponent,
    resolve: {
      token: (): Observable<boolean> => <Observable<boolean>>inject(AuthService).getToken()
    },
    children: [
      { path: '', redirectTo: 'limits', pathMatch: 'full' },
      { path: 'users', title: 'Users', component: UsersViewComponent },
      { path: 'limits', title: 'Limits', component: AdminComponent }
    ]
  },
  { path: 'ticket', title: 'Tickets', component: TicketViewComponent },
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: '', redirectTo: '/ticket', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
