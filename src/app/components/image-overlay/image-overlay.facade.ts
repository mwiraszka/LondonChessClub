import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { PhotosActions, PhotosSelectors } from '@app/store/photos';

@Injectable()
export class ImageOverlayFacade {
  readonly photo$ = this.store.select(PhotosSelectors.overlayPhoto);

  constructor(private readonly store: Store) {}

  onClose(): void {
    this.store.dispatch(PhotosActions.imageOverlayClosed());
  }

  onOverlay(event: MouseEvent): void {
    const clickedElement = (event.target as HTMLElement).tagName;

    // Only close overlay if user clicks outside of image and its components
    if (!['IMG', 'HEADER', 'H4', 'polyline', 'svg'].includes(clickedElement)) {
      this.store.dispatch(PhotosActions.imageOverlayClosed());
    }
  }

  onPreviousImage(): void {
    this.store.dispatch(PhotosActions.previousPhotoRequested());
  }

  onNextImage(): void {
    this.store.dispatch(PhotosActions.nextPhotoRequested());
  }
}
