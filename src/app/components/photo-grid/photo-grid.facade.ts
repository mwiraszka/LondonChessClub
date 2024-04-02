import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { PhotosActions, PhotosSelectors } from '@app/store/photos';
import type { Photo } from '@app/types';

@Injectable()
export class PhotoGridFacade {
  photos$ = this.store.select(PhotosSelectors.photos);

  constructor(private readonly store: Store) {}

  onClickPhoto(photo: Photo): void {
    this.store.dispatch(PhotosActions.imageOverlayOpened({ photo }));
  }
}
