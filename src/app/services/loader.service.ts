import { BehaviorSubject, debounceTime } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading$.asObservable().pipe(debounceTime(150));

  public setIsLoading(value: boolean, limitToTwoSeconds = true): void {
    // Delayed by one tick to prevent Angular's ExpressionChangedAfterItHasBeenCheckedError
    // since spinner is rendered in the App Component after initial change detection
    setTimeout(() => this._isLoading$.next(value));

    if (value && limitToTwoSeconds) {
      setTimeout(() => this._isLoading$.next(false), 2000);
    }
  }
}
