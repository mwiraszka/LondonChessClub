import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ModalSelectors } from '@app/shared/components/modal';
import { ToasterSelectors } from '@app/shared/components/toaster';
import { LoaderService, UpdateService } from '@app/shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isModalOpen$: Observable<boolean>;
  isDisplayingToaster$: Observable<boolean>;
  isLoading!: boolean;

  constructor(
    private loader: LoaderService,
    private store: Store,
    private update: UpdateService
  ) {}

  ngOnInit(): void {
    this.update.subscribeToVersionUpdates();
    this.isModalOpen$ = this.store.pipe(select(ModalSelectors.isOpen));
    this.isDisplayingToaster$ = this.store.pipe(
      select(ToasterSelectors.selectToasts),
      map((toasts) => !!toasts)
    );
    this.loader.status.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }
}
