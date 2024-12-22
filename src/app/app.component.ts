import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';
import { filter, first } from 'rxjs/operators';

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { ModalComponent } from '@app/components/modal/modal.component';
import { NavComponent } from '@app/components/nav/nav.component';
import { ToasterComponent } from '@app/components/toaster/toaster.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { LoaderService } from '@app/services';
import { EventsSelectors } from '@app/store/events';
import { ModalSelectors } from '@app/store/modal';
import { ToasterSelectors } from '@app/store/toaster';
import { UserSettingsActions, UserSettingsSelectors } from '@app/store/user-settings';
import { isDefined } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    ModalComponent,
    NavComponent,
    RouterOutlet,
    ToasterComponent,
    UpcomingEventBannerComponent,
  ],
})
export class AppComponent implements OnInit {
  public readonly nextEvent$ = this.store.select(EventsSelectors.selectNextEvent);
  public readonly showModal$ = this.store.select(ModalSelectors.selectIsOpen);
  public readonly showToaster$ = this.store.select(
    ToasterSelectors.selectIsDisplayingToasts,
  );
  public readonly showUpcomingEventBanner$ = this.store.select(
    UserSettingsSelectors.selectShowUpcomingEventBanner,
  );

  private readonly bannerLastCleared$ = this.store.select(
    UserSettingsSelectors.selectBannerLastCleared,
  );
  public readonly isDarkMode$ = this.store.select(UserSettingsSelectors.selectIsDarkMode);
  public readonly isLoading = true;

  constructor(
    public readonly loaderService: LoaderService,
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly store: Store,
  ) {
    moment.tz.setDefault('America/Toronto');
  }

  ngOnInit(): void {
    this.isDarkMode$.pipe(untilDestroyed(this)).subscribe(isDarkMode => {
      this._document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    });

    this.bannerLastCleared$
      .pipe(first(), filter(isDefined))
      .subscribe(bannerLastCleared => {
        if (moment().diff(bannerLastCleared, 'days') > 0) {
          this.store.dispatch(UserSettingsActions.upcomingEventBannerReinstated());
        }
      });
  }
}
