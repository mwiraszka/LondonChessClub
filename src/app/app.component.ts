import moment from 'moment-timezone';

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { ModalComponent } from '@app/components/modal/modal.component';
import { NavComponent } from '@app/components/nav/nav.component';
import { ToasterComponent } from '@app/components/toaster/toaster.component';
import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner/upcoming-event-banner.component';
import { LoaderService } from '@app/services';

import { AppFacade } from './app.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppFacade],
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
  public isLoading = false;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    public facade: AppFacade,
  ) {
    moment.tz.setDefault('America/Toronto');
  }

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;

      // Manually detect changes to prevent Angular's ExpressionChangedAfterItHasBeenCheckedError
      this.changeDetectionRef.detectChanges();
    });
  }
}
