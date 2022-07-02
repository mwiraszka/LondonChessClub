import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';

import {
  Modal,
  ModalActions,
  ModalButtonActionTypes,
  ModalButtonStyleTypes,
} from '@app/shared/components/modal';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private store: Store, private swUpdate: SwUpdate) {}

  subscribeToVersionUpdates(): void {
    this.swUpdate.versionUpdates.subscribe(() => {
      const modal: Modal = {
        title: 'Website updated',
        body: 'A new version is available and the page needs to reload.',
        buttons: [
          {
            text: 'Ok',
            style: ModalButtonStyleTypes.PRIMARY_SUCCESS,
            action: ModalButtonActionTypes.ACTIVATE_VERSION_UPDATE,
          },
        ],
      };
      this.store.dispatch(ModalActions.modalOpened({ modal }));
    });
  }

  activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => {
      location.reload();
    });
  }
}
