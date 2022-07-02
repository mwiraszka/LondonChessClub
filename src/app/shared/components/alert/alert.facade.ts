import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AlertActions from './store/alert.actions';
import * as AlertSelectors from './store/alert.selectors';

@Injectable({ providedIn: 'root' })
export class AlertFacade {
  alert$ = this.store.select(AlertSelectors.alert);

  constructor(private store: Store) {}

  onClickAction(): void {
    // Currently hard-coded with the only alert action
    this.store.dispatch(AlertActions.seeScheduleSelected());
  }

  onClickClose(): void {
    this.store.dispatch(AlertActions.dismissed());
  }
}
