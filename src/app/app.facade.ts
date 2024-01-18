import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ModalSelectors } from '@app/store/modal';
import { PhotosSelectors } from '@app/store/photos';
import { ToasterSelectors } from '@app/store/toaster';

import { ScheduleSelectors } from './store/schedule';

@Injectable()
export class AppFacade {
  showImageOverlay$ = this.store.select(PhotosSelectors.isOpen);
  showModal$ = this.store.select(ModalSelectors.isOpen);
  upcomingEvent$ = this.store.select(ScheduleSelectors.upcomingEvent);
  showToaster$ = this.store.select(ToasterSelectors.isDisplayingToasts);

  constructor(private readonly store: Store) {}
}
