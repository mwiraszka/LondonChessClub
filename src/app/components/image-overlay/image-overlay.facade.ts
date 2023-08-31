import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ImageOverlayActions, ImageOverlaySelectors } from '@app/store/image-overlay';

@Injectable()
export class ImageOverlayFacade {
  imageUrl$ = this.store.select(ImageOverlaySelectors.imageUrl);

  constructor(private store: Store) {}

  onClickClose(): void {
    this.store.dispatch(ImageOverlayActions.overlayClosed());
  }

  onClickOverlay(event: MouseEvent): void {
    const clickedElement = (event.target as HTMLElement).tagName;

    // Only close overlay if user clicks outside of image and its header
    if (clickedElement !== 'IMG' && clickedElement !== 'HEADER') {
      this.store.dispatch(ImageOverlayActions.overlayClosed());
    }
  }
}
