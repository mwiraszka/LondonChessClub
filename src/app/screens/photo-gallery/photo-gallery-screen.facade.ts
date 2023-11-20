import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ImageOverlayActions } from '@app/store/image-overlay';

@Injectable()
export class PhotoGalleryScreenFacade {
  constructor(private readonly store: Store) {}

  onClickImage(index: number): void {
    const imageUrl = `assets/photos/${index}-lg.jpg`;
    this.store.dispatch(ImageOverlayActions.overlayOpened({ imageUrl }));
  }
}
