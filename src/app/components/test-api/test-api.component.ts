import {Component, OnInit} from '@angular/core';
import {TestApiService} from './test-api.service';
import {finalize} from 'rxjs';

export interface Value {
  number: number
}

@Component({
  selector: 'test-api',
  templateUrl: './test-api.component.html',
  styleUrl: './test-api.component.scss'
})
export class TestApiComponent implements OnInit {
  values!: Value[];
  value!: Value | null;
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
      .subscribe((data: Value[]) => {
        this.values = data;
      });
  }

  addNumber () {
    if (!this.value) {
      return;
    }
    this.testApiService.addValue(this.value)
      .pipe(
        finalize(() => {
          this.value = null
        })
      )
      .subscribe((response) => {
        this.values = response;
      });
  }
}
