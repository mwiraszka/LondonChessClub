import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ImageOverlayActions } from '@app/store/image-overlay';
import { Photo } from '@app/types';

@Injectable()
export class PhotoGalleryScreenFacade {
  constructor(private readonly store: Store) {}

  onClickPhoto(photo: Photo): void {
    this.store.dispatch(ImageOverlayActions.overlayOpened({ photo }));
  }
}
