import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Toast } from '@app/shared/components/toast';

import * as ToasterSelectors from './store/toaster.selectors';
import { ToasterState } from './types/toaster.state';

@Component({
  selector: 'lcc-toaster',
  template: `
    <div *ngFor="let toast of toasts$ | async">
      <lcc-toast [toast]="toast"></lcc-toast>
    </div>
  `,
})
export class ToasterComponent implements OnInit {
  toasts$: Observable<Toast[]>;

  constructor(private store: Store<ToasterState>) {}

  ngOnInit(): void {
    this.toasts$ = this.store.select(ToasterSelectors.selectToasts);
  }
}
