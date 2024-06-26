import {Component, OnDestroy, OnInit} from '@angular/core';
import {TestApiService, Value} from './test-api.service';
import {finalize, Subject, takeUntil} from 'rxjs';
import {ConfirmDialogService} from '../confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'test-api',
  templateUrl: './test-api.component.html',
  styleUrl: './test-api.component.scss'
})
export class TestApiComponent implements OnInit, OnDestroy {
  values!: Value[];
  value!: Value | null;
  displayedColumns: string[] = ['id', 'value', 'actions'];
  destroy: Subject<void> = new Subject<void>();

  constructor(
    private readonly testApiService: TestApiService,
    private readonly confirmDialogService: ConfirmDialogService
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

  addValue() {
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

  openConfirmationDialog(id: number) {
    this.confirmDialogService.openConfirmationDialog()
      .pipe(takeUntil(this.destroy))
      .subscribe((result: boolean): void => {
        if (!result) {
          return;
        }
        this.deleteValue(id);
      });
  }

  private deleteValue(id: number): void {
    this.testApiService.deleteValue(id)
      .subscribe((response) => {
        this.values = response;
      })
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
