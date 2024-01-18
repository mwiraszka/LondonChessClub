import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthSelectors } from '@app/store/auth';
import { PhotosSelectors } from '@app/store/photos';

@Injectable()
export class NavFacade {
  user$ = this.store.select(AuthSelectors.user);
  isUserVerified$ = this.store.select(AuthSelectors.isUserVerified);
  isOverlayOpen$ = this.store.select(PhotosSelectors.isOpen);

  constructor(private readonly store: Store) {}
}
