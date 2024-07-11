import {Component, OnDestroy, OnInit} from '@angular/core';
import {TicketsService} from '../../services/tickets/tickets.service';
import {FormControl, FormGroup} from '@angular/forms';
import {forkJoin, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  adminForm!: FormGroup;

  ticketsCount!: number;
  ticketsLimit!: number;
  ticketsSoldOut!: boolean;

  destroy: Subject<void> = new Subject<void>();

  constructor(
    private readonly ticketsService: TicketsService
  ) {
  }

  ngOnInit(): void {
    this.adminForm = new FormGroup({
      ticketLimit: new FormControl()
    })

    this.adminForm.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((fields) => {
        this.ticketsLimit = fields.ticketLimit;
      });

    forkJoin([
      this.ticketsService.getTicketsLimit(),
      this.ticketsService.getTicketsCount(),
      this.ticketsService.getTicketsSoldOut()
    ])
      .pipe(takeUntil(this.destroy))
      .subscribe(([ticketsLimit, ticketsCount, ticketsSoldOut]): void => {
        this.ticketsLimit = ticketsLimit;
        this.ticketsCount = ticketsCount;
        this.ticketsSoldOut = ticketsSoldOut;
      });
  }

  setTicketsLimit(): void {
    this.ticketsService.setTicketsLimit(this.ticketsLimit)
      .pipe(takeUntil(this.destroy))
      .subscribe();
  }

  setTicketsSoldOut(soldOut: boolean): void {
    this.ticketsService.setTicketsSoldOut(soldOut)
      .pipe(takeUntil(this.destroy))
      .subscribe((response) => {
        this.ticketsSoldOut = response;
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
