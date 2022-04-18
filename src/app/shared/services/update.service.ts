import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';

import {
  Modal,
  ModalActions,
  ModalButtonAction,
  ModalButtonStyle,
  ModalState,
} from '@app/shared/components/modal';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private store: Store<ModalState>, private swUpdate: SwUpdate) {}

  subscribeToVersionUpdates(): void {
    this.swUpdate.versionUpdates.subscribe(() => {
      const modal: Modal = {
        title: 'Website updated',
        body: 'A new version is available and the page needs to reload.',
        buttons: [
          {
            text: 'Ok',
            style: ModalButtonStyle.PRIMARY_SUCCESS,
            action: ModalButtonAction.ACTIVATE_VERSION_UPDATE,
          },
        ],
      };
      this.store.dispatch(ModalActions.modalCreated({ modal }));
    });
  }

  activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => {
      location.reload();
    });
  }
}
