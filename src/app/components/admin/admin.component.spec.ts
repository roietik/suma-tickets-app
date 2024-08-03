import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import {By} from '@angular/platform-browser';
import {TicketsService} from '../../services/tickets/tickets.service';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DebugElement} from '@angular/core';
import {Observable, of} from 'rxjs';

export class AdminComponentPage {
  constructor(
    private _fixture: ComponentFixture<AdminComponent>
  ) {
  }

  get ticketsLimit(): string {
    return this.getTextContent(
      this._fixture.debugElement.query(By.css('[data-selector="tickets-limit"]'))
    );
  }

  get ticketsCount(): string {
    return this.getTextContent(
      this._fixture.debugElement.query(By.css('[data-selector="tickets-count"]'))
    );
  }

  private getTextContent(element: DebugElement): string {
    return element.nativeElement.textContent;
  }
}

describe('AdminComponent', (): void => {
  const given = async (data: {
    getTicketsLimit: number,
    getTicketsCount: number,
    getTicketsSoldOut: boolean
  }):Promise<{adminComponentPage: AdminComponentPage, componentInstance: AdminComponent}> => {
    await TestBed.configureTestingModule({
      declarations: [ AdminComponent ],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: TicketsService,
          useValue: {
            getTicketsLimit: (): Observable<number> => of(data.getTicketsLimit),
            getTicketsCount: (): Observable<number> => of(data.getTicketsCount),
            getTicketsSoldOut: (): Observable<boolean> => of(data.getTicketsSoldOut)
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
    const componentInstance = fixture.componentInstance;

    return {
      adminComponentPage: new AdminComponentPage(fixture),
      componentInstance: componentInstance
    };
  };

  it('should display admin elements', async (): Promise<void> => {
    const { adminComponentPage, componentInstance } = await given({
      getTicketsLimit: 3000,
      getTicketsCount: 3,
      getTicketsSoldOut: true
    });

    expect(adminComponentPage.ticketsLimit).toBe(String(3000));
    expect(adminComponentPage.ticketsCount).toBe(String(3));
    expect(typeof componentInstance.ticketsSoldOut).toBe('boolean');
  });
});
