import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { NavActions } from '@app/store/nav';

@Injectable()
export class LinkListFacade {
  constructor(private store: Store) {}

  onSelect(path: string): void {
    this.store.dispatch(NavActions.linkSelected({ path }));
  }
}
