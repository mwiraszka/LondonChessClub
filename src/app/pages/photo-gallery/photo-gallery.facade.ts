import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ImageOverlayActions } from '@app/shared/components/image-overlay';

@Injectable({ providedIn: 'root' })
export class PhotoGalleryFacade {
  constructor(private store: Store) {}

  onClickImage(index: number): void {
    const imagePath = `assets/photos/${index}-lg.jpg`;
    this.store.dispatch(ImageOverlayActions.overlayOpened({ imagePath }));
  }
}
