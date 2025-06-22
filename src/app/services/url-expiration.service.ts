import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription, timer } from 'rxjs';

import { Injectable, OnDestroy } from '@angular/core';

import { Id, Image } from '@app/models';
import { ImagesActions } from '@app/store/images';
import { ImagesSelectors } from '@app/store/images';

@Injectable({ providedIn: 'root' })
export class UrlExpirationService implements OnDestroy {
  private readonly BUFFER_MS = 15 * 1000;
  private readonly BATCH_SIZE = 20;

  private allImagesSubscription?: Subscription;
  private batchTimer?: Subscription;
  private expirationTimers: Map<Id, Subscription> = new Map();
  private pendingRefreshes: Set<Id> = new Set();
  private processingBatch = false;

  private expirationStatus = new BehaviorSubject<{
    pending: number;
    total: number;
  }>({ pending: 0, total: 0 });
  public expirationStatus$ = this.expirationStatus.asObservable();

  constructor(private readonly store: Store) {}

  public listenToImageChanges(): void {
    this.allImagesSubscription = this.store
      .select(ImagesSelectors.selectAllImages)
      .subscribe(images => {
        images.forEach(image => {
          if (!this.expirationTimers.has(image.id)) {
            this.setupTimer(image);
          }
        });

        this.updateExpirationStatus();
      });
  }

  ngOnDestroy(): void {
    this.expirationTimers.forEach(subscription => subscription.unsubscribe());
    this.expirationTimers.clear();
    this.batchTimer?.unsubscribe();
    this.allImagesSubscription?.unsubscribe();
  }

  public prioritizeImage(imageId: Id): void {
    if (this.pendingRefreshes.has(imageId)) {
      this.processBatchIfNeeded();
    }
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
      this.addToPendingRefreshes(image.id);
      return;
    }

    if (this.expirationTimers.has(image.id)) {
      this.expirationTimers.get(image.id)?.unsubscribe();
    }

    const timerSubscription = timer(timeUntilRefresh).subscribe(() => {
      this.expirationTimers.delete(image.id);
      this.addToPendingRefreshes(image.id);
    });

    this.expirationTimers.set(image.id, timerSubscription);
  }

  private addToPendingRefreshes(imageId: Id): void {
    this.pendingRefreshes.add(imageId);
    this.updateExpirationStatus();

    if (!this.processingBatch) {
      setTimeout(() => this.processBatchIfNeeded(), 100);
    }
  }

  private updateExpirationStatus(): void {
    this.expirationStatus.next({
      pending: this.pendingRefreshes.size,
      total: this.expirationTimers.size + this.pendingRefreshes.size,
    });
  }

  private processBatchIfNeeded(): void {
    if (this.processingBatch || this.pendingRefreshes.size === 0) {
      return;
    }

    this.processingBatch = true;

    const imageIds = Array.from(this.pendingRefreshes).slice(0, this.BATCH_SIZE);

    this.store.dispatch(ImagesActions.fetchImagesRequested({ imageIds }));

    imageIds.forEach(id => this.pendingRefreshes.delete(id));

    this.updateExpirationStatus();

    if (this.pendingRefreshes.size > 0) {
      this.batchTimer = timer(5000).subscribe(() => {
        this.processingBatch = false;
        this.processBatchIfNeeded();
      });
    } else {
      this.processingBatch = false;
    }
  }
}
