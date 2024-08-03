import { TestBed } from '@angular/core/testing';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
  MatSnackBarRef,
  TextOnlySnackBar
} from '@angular/material/snack-bar';
import { NotifyService } from './notify.service';
import {BaseGiven} from '../services.interface';
import Spy = jasmine.Spy;

interface When {
  notifyError: () => void;
  notifySuccess: () => void;
}

interface Then {
  snackBarSpy: Spy<(message: string, action?: string | undefined, config?: MatSnackBarConfig<any> | undefined) => MatSnackBarRef<TextOnlySnackBar>>;
}

type Given = BaseGiven<When, Then>;

fdescribe('NotifyService', (): void => {
  const given = async (response: {message: string, duration: boolean }): Promise<Given> => {
    await TestBed.configureTestingModule({
      imports: [ MatSnackBarModule ],
      providers: [ NotifyService ]
    }).compileComponents();

    const snackBarSpy = spyOn(TestBed.inject(MatSnackBar), 'open');

    return {
      when: {
        notifyError: (): void => TestBed.inject(NotifyService).notifyError(response.message, response.duration),
        notifySuccess: (): void => TestBed.inject(NotifyService).notifySuccess(response.message, response.duration)
      },
      then: {
        snackBarSpy: snackBarSpy
      }
    };
  };

  it('should call MatSnackBar.open with error message and duration is false', async (): Promise<void> => {
    const message = 'This is an error message!';
    const { when, then } = await given({
      message: message,
      duration: false
    });

    when.notifyError();

    expect(then.snackBarSpy).toHaveBeenCalledWith(message, 'Zamknij', {
      panelClass: ['notify-error'],
      duration: undefined
    });
  });

  it('should call MatSnackBar.open with error message and duration is true', async (): Promise<void> => {
    const message = 'This is an error message!';
    const { when, then } = await given({
      message: message,
      duration: true
    });

    when.notifyError();

    expect(then.snackBarSpy).toHaveBeenCalledWith(message, 'Zamknij', {
      panelClass: ['notify-error'],
      duration: 3000
    });
  });

  it('should call MatSnackBar.open with success message and duration is false', async (): Promise<void> => {
    const message = 'Success message!';
    const { when, then } = await given({
      message: message,
      duration: false
    });

    when.notifySuccess();

    expect(then.snackBarSpy).toHaveBeenCalledWith(message, 'Zamknij', {
      panelClass: ['notify-success'],
      duration: undefined
    });
  });

  it('should call MatSnackBar.open with success message and duration is true', async (): Promise<void> => {
    const message = 'Success message!';
    const { when, then } = await given({
      message: message,
      duration: true
    });

    when.notifySuccess();

    expect(then.snackBarSpy).toHaveBeenCalledWith(message, 'Zamknij', {
      panelClass: ['notify-success'],
      duration: 3000
    });
  });
});
