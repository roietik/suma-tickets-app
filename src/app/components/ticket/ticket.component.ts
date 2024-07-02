import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {TicketsService} from '../../services/tickets/tickets.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent implements OnDestroy {
  @Output() downloadResult = new EventEmitter<string | null>();

  // TODO default data
  title = "Suma Bilet 2024";
  description = 'Lorem...';

  // TODO get values from form fields
  firstName = 'Radosław';
  lastName = 'Grzymała';
  email = 'radoslaw.grzymala@hotmail.com';

  private readonly destroy: Subject<void> = new Subject<void>()

  constructor(
    private readonly ticketsService: TicketsService,
  ) {
  }

  downloadAsPDF() {
    this.ticketsService.getTicket({
      title: this.title,
      description: this.description,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      download: true,
      base64: false
    })
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe((result): void => {
        // TODO Save base64 in database (handle in subscribe)
        // TODO Send email request
        console.log('downloadAsPDF', result);
        this.downloadResult.emit(result);
      });
  }

  ngOnDestroy():void {
    this.destroy.next();
  }
}
