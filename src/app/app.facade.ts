import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { ModalSelectors } from '@app/store/modal';
import { PhotosSelectors } from '@app/store/photos';
import { ScheduleSelectors } from '@app/store/schedule';
import { ToasterSelectors } from '@app/store/toaster';
import { UserSettingsSelectors } from '@app/store/user-settings';

@UntilDestroy()
@Injectable()
export class AppFacade {
  isDarkMode$ = this.store.select(UserSettingsSelectors.isDarkMode);
  showImageOverlay$ = this.store.select(PhotosSelectors.isOpen);
  showModal$ = this.store.select(ModalSelectors.isOpen);
  showToaster$ = this.store.select(ToasterSelectors.isDisplayingToasts);
  showUpcomingEventBanner$ = this.store.select(
    UserSettingsSelectors.showUpcomingEventBanner,
  );
  upcomingEvent$ = this.store.select(ScheduleSelectors.upcomingEvent);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly store: Store,
  ) {
    this.isDarkMode$.pipe(untilDestroyed(this)).subscribe(isDarkMode => {
      this.document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    });
  }
}
