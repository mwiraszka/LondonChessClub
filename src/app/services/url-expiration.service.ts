import { Store } from '@ngrx/store';
import { Subscription, timer } from 'rxjs';

import { Injectable, OnDestroy } from '@angular/core';

import { Id, Image } from '@app/models';
import { ImagesActions } from '@app/store/images';
import { ImagesSelectors } from '@app/store/images';

@Injectable({ providedIn: 'root' })
export class UrlExpirationService implements OnDestroy {
  private readonly BUFFER_MS = 15 * 1000;

  private expirationTimers: Map<Id, Subscription> = new Map();
  private allImagesSubscription?: Subscription;

  constructor(private readonly store: Store) {}

  public listenToImageChanges(): void {
    this.allImagesSubscription = this.store
      .select(ImagesSelectors.selectAllImages)
      .subscribe(images =>
        images.forEach(image => {
          if (!this.expirationTimers.has(image.id)) {
            this.setupTimer(image);
          }
        }),
      );
  }

  ngOnDestroy(): void {
    this.expirationTimers.forEach(subscription => subscription.unsubscribe());
    this.expirationTimers.clear();
    this.allImagesSubscription?.unsubscribe();
  }

  private setupTimer(image: Image): void {
    if (!image.urlExpirationDate) {
      console.warn(`[LCC] Image ${image.id} does not include URL expiration date`);
      return;
    }

    const expirationTime = new Date(image.urlExpirationDate).getTime();
    const currentTime = new Date().getTime();
    const timeUntilRefresh = expirationTime - currentTime - this.BUFFER_MS;

    if (timeUntilRefresh <= 0) {
      this.store.dispatch(ImagesActions.fetchImageRequested({ imageId: image.id }));
      return;
    }

    const timerSubscription = timer(timeUntilRefresh).subscribe(() => {
      this.expirationTimers.delete(image.id);
      this.store.dispatch(ImagesActions.fetchImageRequested({ imageId: image.id }));
    });

    this.expirationTimers.set(image.id, timerSubscription);
  }
}
