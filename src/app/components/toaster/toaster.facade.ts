import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ToasterSelectors } from '@app/store/toaster';

@Injectable()
export class ToasterFacade {
  toasts$ = this.store.select(ToasterSelectors.toasts);

  constructor(private store: Store) {}
}
