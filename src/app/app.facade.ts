import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { NavActions, NavSelectors } from '@app/core/nav';
import { AlertSelectors } from '@app/shared/components/alert';
import { ImageOverlaySelectors } from '@app/shared/components/image-overlay';
import { ModalSelectors } from '@app/shared/components/modal';
import { ToasterSelectors } from '@app/shared/components/toaster';

@Injectable()
export class AppFacade {
  showAlert$ = this.store.select(AlertSelectors.isActive);
  showImageOverlay$ = this.store.select(ImageOverlaySelectors.isOpen);
  showModal$ = this.store.select(ModalSelectors.isOpen);
  showToaster$ = this.store.select(ToasterSelectors.isDisplayingToasts);

  constructor(private readonly store: Store) {}

  onClickApp(event: MouseEvent): void {
    if (
      this.store.select(NavSelectors.isDropdownOpen) &&
      !(event.target as HTMLElement).classList.contains('lcc-dropdown-element')
    ) {
      this.store.dispatch(NavActions.dropdownClosed());
    }
  }
}
