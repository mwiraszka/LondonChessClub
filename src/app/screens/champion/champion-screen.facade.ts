import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { NavActions } from '@app/store/nav';

@Injectable()
export class ChampionScreenFacade {
  constructor(private store: Store) {}

  onNavigate(path: string): void {
    this.store.dispatch(NavActions.linkSelected({ path }));
  }
}
