import {NgModule} from '@angular/core';
import {AdminViewComponent} from './admin-view/admin-view.component';
import {TicketViewComponent} from './ticket-view/ticket-view.component';
import {ComponentsModule} from '../components/components.module';
import {NgIf} from '@angular/common';

@NgModule({
  imports: [
    ComponentsModule,
    NgIf
  ],
  declarations: [
    AdminViewComponent,
    TicketViewComponent
  ]
})
export class ViewsModule {
}