import {NgModule} from '@angular/core';
import {AdminViewComponent} from './admin-view/admin-view.component';
import {TicketViewComponent} from './ticket-view/ticket-view.component';
import {ComponentsModule} from '../components/components.module';
import {NgIf} from '@angular/common';
import {UsersViewComponent} from './users-view/users-view.component';
import {RouterOutlet} from '@angular/router';

@NgModule({
  imports: [
    ComponentsModule,
    NgIf,
    RouterOutlet
  ],
  declarations: [
    AdminViewComponent,
    TicketViewComponent,
    UsersViewComponent
  ]
})
export class ViewsModule {
}