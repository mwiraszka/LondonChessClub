import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { LoaderService, UpdateService } from '@app/shared/services';

import { AppFacade } from './app.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppFacade],
})
export class AppComponent implements OnInit {
  isLoading!: boolean;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private loader: LoaderService,
    private update: UpdateService,
    public facade: AppFacade
  ) {}

  ngOnInit(): void {
    this.update.subscribeToVersionUpdates();
    this.loader.status$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
      this.changeDetectionRef.detectChanges();
    });
  }
}
