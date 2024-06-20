import {Component, OnInit} from '@angular/core';
import {TestApiService} from './test-api.service';
import {finalize, switchMap} from 'rxjs';

@Component({
  selector: 'test-api',
  templateUrl: './test-api.component.html',
  styleUrl: './test-api.component.scss'
})
export class TestApiComponent implements OnInit {
  numbers!: number[];
  number!: number | null;
  displayedColumns: string[] = ['number'];

  constructor(
    private readonly testApiService: TestApiService
  ){
  }

  ngOnInit(): void {
    this.getNumbers();
  }

  private getNumbers () {
    this.testApiService.getValues()
      .subscribe((data: number[]) => {
        this.numbers = data;
      });
  }

  addNumber () {
    if (!this.number) {
      return;
    }
    this.testApiService.addValue(this.number)
      .pipe(
        switchMap(() => {
          return this.testApiService.getValues();
        }),
        finalize(() => {
          this.number = null
        })
      )
      .subscribe((response) => {
        this.numbers = response;
      });
  }
}
