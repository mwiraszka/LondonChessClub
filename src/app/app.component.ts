import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NavActions, NavSelectors } from '@app/core/nav';
import { AlertSelectors } from '@app/shared/components/alert';
import { ImageOverlaySelectors } from '@app/shared/components/image-overlay';
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
  showImageOverlay$: Observable<boolean>;
  showModal$: Observable<boolean>;
  showToaster$: Observable<boolean>;
  isLoading!: boolean;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private loader: LoaderService,
    private store: Store,
    private update: UpdateService
  ) {}

  ngOnInit(): void {
    this.update.subscribeToVersionUpdates();
    this.showAlert$ = this.store.select(AlertSelectors.isActive);
    this.showImageOverlay$ = this.store.select(ImageOverlaySelectors.isOpen);
    this.showModal$ = this.store.select(ModalSelectors.isOpen);
    this.showToaster$ = this.store.select(ToasterSelectors.isDisplayingToasts);
    this.loader.status$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
      this.changeDetectionRef.detectChanges();
    });
  }

  onClickApp(event: MouseEvent): void {
    if (
      this.store.select(NavSelectors.isDropdownOpen) &&
      !(event.target as HTMLElement).classList.contains('lcc-dropdown-element')
    ) {
      this.store.dispatch(NavActions.dropdownClosed());
    }
  }
}
