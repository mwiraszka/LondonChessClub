import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  ImageOverlayActions,
  ImageOverlaySelectors,
} from '@app/shared/components/image-overlay';

@Injectable({ providedIn: 'root' })
export class ImageOverlayFacade {
  imagePath$ = this.store.select(ImageOverlaySelectors.imagePath);

  constructor(private store: Store) {}

  onClickClose() {
    this.store.dispatch(ImageOverlayActions.overlayClosed());
  }

  onClickOverlay(event: MouseEvent) {
    const clickedElement = (event.target as HTMLElement).tagName;

    // Only close overlay if user clicks outside of image and its header
    if (clickedElement !== 'IMG' && clickedElement !== 'HEADER') {
      this.store.dispatch(ImageOverlayActions.overlayClosed());
    }
  }
}
