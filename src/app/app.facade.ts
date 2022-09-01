import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ImageOverlaySelectors } from '@app/store/image-overlay';
import { ModalSelectors } from '@app/store/modal';
import { ScheduleSelectors } from './store/schedule';
import { ToasterSelectors } from '@app/store/toaster';

@Injectable()
export class AppFacade {
  showImageOverlay$ = this.store.select(ImageOverlaySelectors.isOpen);
  showModal$ = this.store.select(ModalSelectors.isOpen);
  nextEvent$ = this.store.select(ScheduleSelectors.nextEvent);
  showToaster$ = this.store.select(ToasterSelectors.isDisplayingToasts);

  constructor(private readonly store: Store) {}
}
