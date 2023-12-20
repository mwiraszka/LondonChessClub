import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { ModalActions } from '@app/store/modal';
import { Modal, ModalButtonActionTypes, ModalButtonStyleTypes } from '@app/types';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private readonly store: Store, private swUpdate: SwUpdate) {}

  subscribeToVersionUpdates(): void {
    this.swUpdate.versionUpdates
      .pipe(filter(versionEvent => versionEvent.type !== 'NO_NEW_VERSION_DETECTED'))
      .subscribe(() => {
        const modal: Modal = {
          title: 'Website updated',
          body: 'A new version is available and the page needs to reload.',
          buttons: [
            {
              text: 'Ok',
              style: ModalButtonStyleTypes.CONFIRM,
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
