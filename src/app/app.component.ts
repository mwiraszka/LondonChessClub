import moment from 'moment-timezone';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { LoaderService } from '@app/services';

import { AppFacade } from './app.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppFacade],
})
export class AppComponent implements OnInit {
  isLoading!: boolean;
  showAlert = true;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    public facade: AppFacade,
  ) {
    moment.tz.setDefault('America/Toronto');
  }

  ngOnInit(): void {
    this.loaderService.status$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
      this.changeDetectionRef.detectChanges();
    });
  }

  onCloseAlert(): void {
    this.showAlert = false;
  }
}
