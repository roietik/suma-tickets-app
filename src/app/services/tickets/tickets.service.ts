import {Injectable} from '@angular/core';
import JsBarcode from 'jsbarcode';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {CustomPageSize, Margins, PageOrientation, TDocumentDefinitions} from 'pdfmake/interfaces';
import {TICKET_FILE_NAME, TICKET_IMAGE_BASE64, TICKET_NUMBER_PREFIX} from './image-base64';
import {concat, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface PdfConfig {
  title: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  download: boolean;
  base64: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private createBarCode(): SVGElement {
    const uniqueTicketNumber: string = this.generateUniqueTicketNumber(),
      svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svgElement.setAttribute('id', 'ticket');
    JsBarcode(svgElement, uniqueTicketNumber);
    return svgElement;
  }

  private generateUniqueTicketNumber(): string {
    // TODO Get ticketNumber from API
    const ticketNumber = 1;
    return `${TICKET_NUMBER_PREFIX}: ${this.formatTicketNumber(ticketNumber)}-${this.generateRandomNumber()}`;
  }

  private formatTicketNumber(ticketNumber: number): string {
    let ticket = String(ticketNumber);
    while (ticket.length < 4) {
      ticket = '0' + ticket;
    }
    return ticket;
  }

  private generateRandomNumber(numberOfDigits: number = 9): number {
    // Calculate the upper and lower bounds based on the number of digits
    const upperBound: number = Math.pow(10, numberOfDigits) - 1,
      lowerBound: number = Math.pow(10, numberOfDigits - 1);

    return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
  }

  getTicket(pdfConfig: PdfConfig): Observable<string | null> {
    const download$ = pdfConfig.download ? this.downloadPdf$(pdfConfig) : of(null),
      base64$ = pdfConfig.base64 ? this.generateBase64$(pdfConfig) : of(null);

    return concat(download$, base64$);
  }

  private downloadPdf$(pdfConfig: PdfConfig): Observable<string | null> {
    const pdfDocGenerator = pdfMake.createPdf(this.createDocumentDefinition(pdfConfig));

    try {
      pdfDocGenerator.download(TICKET_FILE_NAME);
      return of('Success downloading PDF');
    }
    catch(error) {
      console.error('Error downloading PDF:', error);
      return of(null);
    }
  }

  private generateBase64$(pdfConfig: PdfConfig): Observable<string | null> {
    const pdfDocGenerator = pdfMake.createPdf(this.createDocumentDefinition(pdfConfig));

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
      .pipe(catchError(() => of(null)));
  }

  private createDocumentDefinition(pdfConfig: PdfConfig): TDocumentDefinitions {
    pdfMake.fonts = {
      Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      },
    }

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
          text: pdfConfig.title,
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
              [ pdfConfig.firstName, pdfConfig.lastName, pdfConfig.email ]
            ]
          }
        },
        {
          text: pdfConfig.description,
          margin: [ 0, 2, 10, 20 ] as Margins,
          style: 'description'
        },
        {
          svg: this.createBarCode().outerHTML
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
    };
  }
}