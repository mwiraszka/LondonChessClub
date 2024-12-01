import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { filter, first } from 'rxjs/operators';

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { ModalSelectors } from '@app/store/modal';
import { PhotosSelectors } from '@app/store/photos';
import { ScheduleSelectors } from '@app/store/schedule';
import { ToasterSelectors } from '@app/store/toaster';
import { UserSettingsActions, UserSettingsSelectors } from '@app/store/user-settings';
import { isDefined } from '@app/utils';

@UntilDestroy()
@Injectable()
export class AppFacade {
  readonly ONE_DAY_MS = 1000 * 60 * 60 * 24;

  readonly bannerLastCleared$ = this.store.select(
    UserSettingsSelectors.bannerLastCleared,
  );
  readonly isDarkMode$ = this.store.select(UserSettingsSelectors.isDarkMode);
  readonly showImageOverlay$ = this.store.select(PhotosSelectors.isOpen);
  readonly showModal$ = this.store.select(ModalSelectors.isOpen);
  readonly showToaster$ = this.store.select(ToasterSelectors.isDisplayingToasts);
  readonly showUpcomingEventBanner$ = this.store.select(
    UserSettingsSelectors.showUpcomingEventBanner,
  );
  readonly upcomingEvent$ = this.store.select(ScheduleSelectors.upcomingEvent);

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private readonly store: Store,
  ) {
    this.isDarkMode$.pipe(untilDestroyed(this)).subscribe(isDarkMode => {
      this._document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    });

    this.bannerLastCleared$
      .pipe(first(), filter(isDefined))
      .subscribe(lastClearedTime => {
        const currentTime = new Date().getTime();
        if (currentTime - lastClearedTime > this.ONE_DAY_MS) {
          this.store.dispatch(UserSettingsActions.reinstateUpcomingEventBanner());
        }
      });
  }
}
