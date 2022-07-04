import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ToasterSelectors from './store/toaster.selectors';

@Injectable()
export class ToasterFacade {
  toasts$ = this.store.select(ToasterSelectors.toasts);

  constructor(private store: Store) {}
}
