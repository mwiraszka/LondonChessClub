import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as AlertActions from './store/alert.actions';
import * as AlertSelectors from './store/alert.selectors';
import { AlertAction } from './types/alert-action.model';
import { Alert } from './types/alert.model';

@Component({
  selector: 'lcc-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}
  AlertAction = AlertAction;

  alert?: Alert | null;
  alertSubscription?: Subscription;

  ngOnInit(): void {
    ClarityIcons.addIcons(windowCloseIcon);

    this.alertSubscription = this.store
      .select(AlertSelectors.alert)
      .pipe(tap((alert) => (this.alert = alert)))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe();
  }

  onSelectAction(action: AlertAction): void {
    if (action === AlertAction.SEE_SCHEDULE) {
      this.store.dispatch(AlertActions.seeScheduleSelected());
    } else {
      this.store.dispatch(AlertActions.dismissed());
    }
  }
}
