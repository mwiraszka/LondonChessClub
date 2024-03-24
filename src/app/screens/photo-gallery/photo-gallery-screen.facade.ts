import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { PhotosActions } from '@app/store/photos';
import type { Photo } from '@app/types';

@Injectable()
export class PhotoGalleryScreenFacade {
  constructor(private readonly store: Store) {}

  onClickPhoto(photo: Photo): void {
    this.store.dispatch(PhotosActions.imageOverlayOpened({ photo }));
  }
}
