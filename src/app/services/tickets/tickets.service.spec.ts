import { TestBed } from '@angular/core/testing';

import {TicketConfig, TicketsService} from './tickets.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {Observable} from 'rxjs';
import {API_CONFIG, BaseGiven} from '../services.interface';

interface When {
  getTicket: () => Observable<string | null>;
  getUniqueTicketId: () => Observable<number>;
  setTicketsLimit: (limit: number) => Observable<{ticketsLimit: string}>;
  getTicketsLimit: () => Observable<number>;
  setTicketsSoldOut: (limit: boolean) => Observable<boolean>;
  getTicketsSoldOut: () => Observable<boolean>;
  getTicketsCount: () => Observable<number>;
}

interface Then {
  expectUrl: (expectedUrl: string, type: string) => TestRequest;
}

type Given = BaseGiven<When, Then>;

const ticketConfig: TicketConfig = {
  title: 'Bilet',
  description: 'bilet na wydarzenie',
  firstName: 'Jan',
  lastName: 'Kowalski',
  email: 'jankowalski@gmail.com',
  download: true,
  base64: true
};

const ticketsLimit: number = 3000;
const ticketsSoldOut: boolean = false;

const isBase64 = (base64: string | null): boolean => {
  if (!base64) {
    return false;
  }
  const base64Regex = /^([0-9A-Za-z+/]{4})*([0-9A-Za-z+/]{3}=|[0-9A-Za-z+/]{2}==)?$/;
  return base64Regex.test(base64);
};

describe('TicketService', (): void => {
  const given = async (response: TicketConfig | number | { ticketsLimit: string } | boolean): Promise<Given> => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketsService]
    });

    return {
      when: {
        getTicket: (): Observable<string | null> => TestBed.inject(TicketsService).getTicket(ticketConfig),
        getUniqueTicketId: (): Observable<number> => TestBed.inject(TicketsService).getUniqueTicketId(),
        setTicketsLimit: (): Observable<{ ticketsLimit: string }> => TestBed.inject(TicketsService).setTicketsLimit(ticketsLimit),
        getTicketsLimit: (): Observable<number> => TestBed.inject(TicketsService).getTicketsLimit(),
        setTicketsSoldOut: (): Observable<boolean> => TestBed.inject(TicketsService).setTicketsSoldOut(ticketsSoldOut),
        getTicketsSoldOut: (): Observable<boolean> => TestBed.inject(TicketsService).getTicketsSoldOut(),
        getTicketsCount: (): Observable<number> => TestBed.inject(TicketsService).getTicketsCount()
      },
      then: {
        expectUrl: (expectedUrl: string, type: string): TestRequest => {
          const httpTestingController = TestBed.inject(HttpTestingController);
          const req = httpTestingController.expectOne(expectedUrl);
          expect(req.request.method).toEqual(type);
          req.flush(response);
          httpTestingController.verify();

          return req;
        }
      }
    };
  };

  it('should return ticket', async (): Promise<void> => {
    const {when, then} = await given(ticketConfig);

    when.getTicket().subscribe((ticket): void => {
      expect(isBase64(ticket)).toBeTruthy();
    });

    const req = then.expectUrl(`${API_CONFIG.TICKETS}/unique-id`, 'GET');
    expect(req.request.method).toEqual('GET');
  });

  it('should return unique id', async (): Promise<void> => {
    const {when, then} = await given(1);

    when.getUniqueTicketId().subscribe((ticketId): void => {
      expect(ticketId).toBe(1);
    });

    const req = then.expectUrl(`${API_CONFIG.TICKETS}/unique-id`, 'GET');
    expect(req.request.method).toEqual('GET');
  });

  it('should return limit as object', async (): Promise<void> => {
    const {when, then} = await given({ ticketsLimit: String(3000) });

    when.setTicketsLimit(ticketsLimit).subscribe((limit): void => {
      expect(limit).toEqual({ ticketsLimit: String(3000) });
    });

    const req = then.expectUrl(`${API_CONFIG.TICKETS}/limit`, 'POST');
    expect(req.request.method).toEqual('POST');
  });

  it('should return limit', async (): Promise<void> => {
    const {when, then} = await given(3000);

    when.getTicketsLimit().subscribe((limit): void => {
      expect(limit).toEqual(3000);
    });

    const req = then.expectUrl(`${API_CONFIG.TICKETS}/limit`, 'GET');
    expect(req.request.method).toEqual('GET');
  });

  it('should return boolean', async (): Promise<void> => {
    const {when, then} = await given(true);

    when.setTicketsSoldOut(true).subscribe((limit): void => {
      expect(limit).toEqual(true);
    });

    const req = then.expectUrl(`${API_CONFIG.TICKETS}/sold-out`, 'POST');
    expect(req.request.method).toEqual('POST');
  });

  it('should return boolean', async (): Promise<void> => {
    const {when, then} = await given(false);

    when.getTicketsSoldOut().subscribe((limit): void => {
      expect(limit).toEqual(false);
    });

    const req = then.expectUrl(`${API_CONFIG.TICKETS}/sold-out`, 'GET');
    expect(req.request.method).toEqual('GET');
  });

  it('should return boolean', async (): Promise<void> => {
    const {when, then} = await given(2);

    when.getTicketsCount().subscribe((count): void => {
      expect(count).toEqual(2);
    });

    const req = then.expectUrl(`${API_CONFIG.TICKETS}/count`, 'GET');
    expect(req.request.method).toEqual('GET');
  });
});
