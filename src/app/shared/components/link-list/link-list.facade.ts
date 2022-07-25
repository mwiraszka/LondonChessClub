import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Link } from '@app/shared/types';
import { NavActions } from '@app/core/nav';

@Injectable()
export class LinkListFacade {
  constructor(private store: Store) {}

  onSelect(link: Link): void {
    this.store.dispatch(NavActions.linkSelected({ link }));
  }
}
