import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AlertSelectors } from '@app/shared/components/alert';
import { ModalSelectors } from '@app/shared/components/modal';
import { ToasterSelectors } from '@app/shared/components/toaster';
import { LoaderService, UpdateService } from '@app/shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showAlert$: Observable<boolean>;
  showModal$: Observable<boolean>;
  showToasts$: Observable<boolean>;
  isLoading!: boolean;

  constructor(
    private loader: LoaderService,
    private store: Store,
    private update: UpdateService
  ) {}

  ngOnInit(): void {
    this.update.subscribeToVersionUpdates();
    this.showAlert$ = this.store.select(AlertSelectors.isActive);
    this.showModal$ = this.store.select(ModalSelectors.isOpen);
    this.showToasts$ = this.store.select(ToasterSelectors.isDisplayingToasts);
    this.loader.status.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }
}
