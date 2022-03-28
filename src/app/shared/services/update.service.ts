import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';

import {
  ModalActions,
  ModalButtonActionTypes,
  ModalButtonClassTypes,
  ModalContent,
  ModalState,
} from '@app/shared/components/modal';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private store: Store<ModalState>, private swUpdate: SwUpdate) {}

  subscribeToVersionUpdates(): void {
    this.swUpdate.versionUpdates.subscribe(() => {
      const content: ModalContent = {
        title: 'Website updated',
        body: 'A new version is available and the page needs to reload.',
        buttons: [
          {
            text: 'Ok',
            class: ModalButtonClassTypes.CONFIRM_GREEN,
            action: ModalButtonActionTypes.ACTIVATE_VERSION_UPDATE,
          },
        ],
      };
      this.store.dispatch(ModalActions.modalCreated({ content }));
    });
  }

  activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => {
      location.reload();
    });
  }
}
