import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { NavActions } from '@app/store/nav';

@Injectable()
export class AboutScreenFacade {
  constructor(private store: Store) {}

  onNavigate(path: string): void {
    this.store.dispatch(NavActions.linkSelected({ path }));
  }
}
