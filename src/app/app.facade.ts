import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ImageOverlaySelectors } from '@app/store/image-overlay';
import { ModalSelectors } from '@app/store/modal';
import { ToasterSelectors } from '@app/store/toaster';

import { ScheduleSelectors } from './store/schedule';

@Injectable()
export class AppFacade {
  showImageOverlay$ = this.store.select(ImageOverlaySelectors.isOpen);
  showModal$ = this.store.select(ModalSelectors.isOpen);
  upcomingEvent$ = this.store.select(ScheduleSelectors.upcomingEvent);
  showToaster$ = this.store.select(ToasterSelectors.isDisplayingToasts);

  constructor(private readonly store: Store) {}
}
