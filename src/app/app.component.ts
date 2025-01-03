import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import moment from 'moment-timezone';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { NavComponent } from '@app/components/nav/nav.component';
import { ToasterComponent } from '@app/components/toaster/toaster.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { LoaderService } from '@app/services';
import { AppActions, AppSelectors } from '@app/store/app';
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
    NavComponent,
    RouterOutlet,
    ToasterComponent,
    UpcomingEventBannerComponent,
  ],
})
export class AppComponent extends CdkScrollable implements OnInit {
  public readonly appViewModel$ = this.store.select(AppSelectors.selectAppViewModel);

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    public readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {
    super();

    moment.tz.setDefault('America/Toronto');

    // TODO
    this.scrollDispatcher.scrolled().subscribe(event => {
      console.log(':: app - scroll event', event);
    });
    this.scrollDispatcher.ancestorScrolled(this.elementRef).subscribe(event => {
      console.log(':: app - ancestor scroll event', event);
    });
    console.log(':: app - containers', this.scrollDispatcher.scrollContainers);
    console.log(
      ':: app - ancestory containers',
      this.scrollDispatcher.getAncestorScrollContainers(this.elementRef),
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.appViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ isDarkMode, bannerLastCleared }) => {
        this._document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

        if (
          isDefined(bannerLastCleared) &&
          moment().diff(bannerLastCleared, 'days') > 0
        ) {
          this.store.dispatch(AppActions.upcomingEventBannerReinstated());
        }
      });
  }
}
