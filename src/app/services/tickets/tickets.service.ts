import {Injectable} from '@angular/core';
import JsBarcode from 'jsbarcode';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {CustomPageSize, Margins, PageOrientation, TDocumentDefinitions} from 'pdfmake/interfaces';
import {TICKET_IMAGE_BASE64} from './image-base64';
import {concat, map, Observable, of, switchMap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {API_CONFIG} from '../services.interface';
import {HandleErrorService} from '../handle-error/handle-error.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface TicketConfig {
  title: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  download: boolean;
  base64: boolean;
}
export interface DocumentConfig extends TicketConfig {
  uniqueId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  readonly TICKET_NUMBER_PREFIX = 'SUMA-24';
  readonly TICKET_FILE_NAME = 'ticket-suma-2024';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly handleErrorService: HandleErrorService
  ) {
  }

  getTicket(ticketConfig: TicketConfig): Observable<string | null> {
    return this.getUniqueTicketId()
      .pipe(
        map((uniqueId) => {
          const documentConfig: DocumentConfig = {...ticketConfig, uniqueId: Number(uniqueId)}
          return documentConfig;
        }),
        switchMap((pdfConfig) => {
          return this.getDocument(pdfConfig);
        }),
        catchError((response) => this.handleErrorService.get(response))
      )
  }

  getUniqueTicketId(): Observable<string> {
    return this.httpClient.get<string>(`${API_CONFIG.TICKETS}/unique-id`)
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  private getDocument(documentConfig: DocumentConfig): Observable<string | null> {
    const download$ = documentConfig.download
        ? this.getDocumentDownload(documentConfig)
        : of(),
      base64$ = documentConfig.base64
        ? this.getDocumentBase64(documentConfig)
        : of();

    return concat(download$, base64$)
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  private getDocumentDownload(documentConfig: DocumentConfig): Observable<string | null> {
    const pdfDocGenerator = pdfMake.createPdf(this.createDocumentDefinition(documentConfig));

    try {
      pdfDocGenerator.download(this.TICKET_FILE_NAME);
      return of();
    }
    catch(error) {
      console.error('Error downloading PDF:', error);
      return of();
    }
  }

  private getDocumentBase64(documentConfig: DocumentConfig): Observable<string | null> {
    const pdfDocGenerator = pdfMake.createPdf(this.createDocumentDefinition(documentConfig));

    return new Observable<string>(observer => {
      try {
        pdfDocGenerator.getBase64((base64: string) => {
          observer.next(base64);
          observer.complete();
        });
      } catch (error) {
        observer.error(error);
      }
    })
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  private createDocumentDefinition(documentConfig: DocumentConfig): TDocumentDefinitions {
    return {
      pageSize: {width: 700, height: 600} as CustomPageSize,
      pageOrientation: 'portrait' as PageOrientation,
      info: {
        title: 'Bilet Suma Mikro Festival 2024',
        author: 'Radosław Grzymała',
      },
      defaultStyle: {
        font: 'Roboto'
      },
      content: [
        {
          text: documentConfig.title,
          margin: [ 0, 2, 10, 8 ] as Margins,
          style: 'title'
        },
        {
          image: TICKET_IMAGE_BASE64,
          width: 520
        },
        {
          style: 'tableExample',
          table: {
            widths: [100, '*', 250],
            body: [
              [ 'Imię', 'Nazwisko', 'Email' ],
              [ documentConfig.firstName, documentConfig.lastName, documentConfig.email ]
            ]
          }
        },
        {
          text: documentConfig.description,
          margin: [ 0, 2, 10, 20 ] as Margins,
          style: 'description'
        },
        {
          svg: this.createBarCode(documentConfig.uniqueId).outerHTML
        }
      ],
      styles: {
        title: {
          fontSize: 22,
          bold: true
        },
        description: {
          fontSize: 14,
        }
      }
    }
  }

  private createBarCode(uniqueId: number): SVGElement {
    const barCodeNumber: string = this.getBarCodeNumber(uniqueId),
      svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svgElement.setAttribute('id', 'ticket');
    JsBarcode(svgElement, barCodeNumber);

    return svgElement;
  }

  private getBarCodeNumber(uniqueId: number): string {
    return `${this.TICKET_NUMBER_PREFIX}: ${this.formatNumber(uniqueId)}-${this.randomNumber()}`;
  }

  private formatNumber(ticketNumber: number): string {
    let ticket = String(ticketNumber);
    while (ticket.length < 4) {
      ticket = '0' + ticket;
    }
    return ticket;
  }

  private randomNumber(numberOfDigits: number = 9): number {
    // Calculate the upper and lower bounds based on the number of digits
    const upperBound: number = Math.pow(10, numberOfDigits) - 1,
      lowerBound: number = Math.pow(10, numberOfDigits - 1);

    return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
  }

  setTicketsLimit(ticketsLimit: number): Observable<{ticketsLimit: string}> {
    return this.httpClient.post<{ticketsLimit: string}>(`${API_CONFIG.TICKETS}/limit`, {
      ticketsLimit: ticketsLimit
    })
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  getTicketsLimit(): Observable<number> {
    return this.httpClient.get<string>(`${API_CONFIG.TICKETS}/limit`)
      .pipe(
        map((response) => Number(response)),
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  setTicketsSoldOut(ticketsSoldOut: boolean): Observable<boolean> {
    return this.httpClient.post<boolean>(`${API_CONFIG.TICKETS}/sold-out`, {
      ticketsSoldOut: ticketsSoldOut
    }).pipe(
      catchError((response) => this.handleErrorService.get(response))
    );
  }

  getTicketsSoldOut(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${API_CONFIG.TICKETS}/sold-out`)
      .pipe(
        catchError((response) => this.handleErrorService.get(response))
      );
  }

  getTicketsCount(): Observable<number> {
    return this.httpClient.get<string>(`${API_CONFIG.TICKETS}/count`)
      .pipe(
        map((response) => Number(response)),
        catchError((response) => this.handleErrorService.get(response))
      );
  }
}