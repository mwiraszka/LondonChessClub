import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Link } from '@app/types';
import { NavActions } from '@app/store/nav';

@Injectable()
export class LinkListFacade {
  constructor(private store: Store) {}

  onSelect(link: Link): void {
    this.store.dispatch(NavActions.linkSelected({ link }));
  }
}
