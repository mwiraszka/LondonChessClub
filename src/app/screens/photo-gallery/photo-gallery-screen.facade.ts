import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ImageOverlayActions } from '@app/shared/components/image-overlay';

@Injectable()
export class PhotoGalleryScreenFacade {
  constructor(private store: Store) {}

  onClickImage(index: number): void {
    const imageUrl = `assets/photos/${index}-lg.jpg`;
    this.store.dispatch(ImageOverlayActions.overlayOpened({ imageUrl }));
  }
}
