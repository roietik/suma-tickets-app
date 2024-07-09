import {Component, OnInit} from '@angular/core';
import {TicketsService} from '../../services/tickets/tickets.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  generatedTickets = 0;
  maxTickets = 500;

  constructor(
    private readonly ticketsService: TicketsService
  ) {
  }

  ngOnInit(): void {
     this.ticketsService.getUniqueTicketId()
      .pipe()
      .subscribe((response) => {
        console.log('response', response);
        this.generatedTickets = Number(response) - 1;
      });

  }

  generateTicket(): void {
    if (this.generatedTickets >= this.maxTickets) {
      console.warn('Ticket generation limit reached (500 tickets).');
      return;
    }

    // Perform ticket generation logic here (e.g., call an API, update local storage, etc.)
    console.log('Ticket generated:', this.generatedTickets + 1);
    this.generatedTickets++;
  }
}
