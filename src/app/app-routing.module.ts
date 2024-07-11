import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminViewComponent} from './views/admin-view/admin-view.component';
import {TicketViewComponent} from './views/ticket-view/ticket-view.component';
import {LoginComponent} from './components/login/login.component';

export const routes: Routes = [
  { path: 'admin', component: AdminViewComponent },
  { path: 'ticket', component: TicketViewComponent },
  { path: 'login', component: LoginComponent },
  { path: '',   redirectTo: '/ticket', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
