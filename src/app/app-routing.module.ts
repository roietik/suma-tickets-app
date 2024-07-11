import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminComponent} from './components/admin/admin.component';
import {UserFormComponent} from './components/user-form/user-form.component';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'ticket', component: UserFormComponent },
  { path: '',   redirectTo: '/ticket', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
