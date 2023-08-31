import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public status$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  display(value: boolean): void {
    this.status$.next(value);
  }
}
