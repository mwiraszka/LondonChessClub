import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

@Injectable()
export class GameArchivesScreenFacade {
  constructor(private readonly store: Store) {}
}
