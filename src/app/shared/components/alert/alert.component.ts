import { Component, OnInit } from '@angular/core';
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
export class AlertComponent implements OnInit {
  constructor(private store: Store) {}
  alert?: Alert | null;
  alertSubscription?: Subscription;

  ngOnInit(): void {
    ClarityIcons.addIcons(windowCloseIcon);
    this.alertSubscription = this.store
      .select(AlertSelectors.alert)
      .pipe(tap((alert) => (this.alert = alert)))
      .subscribe();
  }

  onSelectAction(): void {
    this.store.dispatch(AlertActions.actionTaken({ action: this.alert?.action }));
  }

  onClose(): void {
    this.store.dispatch(AlertActions.actionTaken({ action: AlertAction.CLOSE }));
  }
}
