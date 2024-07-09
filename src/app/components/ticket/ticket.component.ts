import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {TicketsService} from '../../services/tickets/tickets.service';
import {Subject, takeUntil} from 'rxjs';
import {User} from '../../services/users/users.service';

@Component({
  selector: 'ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent implements OnDestroy {
  @Input() user!: User;
  @Output() downloadResult = new EventEmitter<string | null>();

  TICKET_TITLE = "Suma Bilet 2024";
  TICKET_DESCRIPTION = 'Lorem...';

  private readonly destroy: Subject<void> = new Subject<void>()

  constructor(
    private readonly ticketsService: TicketsService,
  ) {
  }

  downloadAsPDF() {
    this.ticketsService.getTicket({
      title: this.TICKET_TITLE,
      description: this.TICKET_DESCRIPTION,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      download: true,
      base64: true
    })
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((response): void => {
        console.log('response', response);
        this.downloadResult.emit(response);
      });
  }

  ngOnDestroy():void {
    this.destroy.next();
  }
}
