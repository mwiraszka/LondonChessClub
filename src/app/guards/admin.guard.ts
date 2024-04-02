import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AuthSelectors } from '@app/store/auth';

@Injectable({ providedIn: 'root' })
export class AdminGuard {
  constructor(private readonly store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.isAdmin).pipe(map(isAdmin => !!isAdmin));
  }
}
