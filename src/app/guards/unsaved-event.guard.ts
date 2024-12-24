import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { Injectable } from '@angular/core';

import { ModalComponent } from '@app/components/modal/modal.component';
import { DialogService } from '@app/services';
import { EventsSelectors } from '@app/store/events';
import { Modal, ModalResult } from '@app/types';

@Injectable({ providedIn: 'root' })
export class UnsavedEventGuard {
  constructor(
    private readonly dialogService: DialogService<ModalComponent, ModalResult>,
    private readonly store: Store,
  ) {}

  async canDeactivate(): Promise<boolean> {
    const hasUnsavedChanges = await firstValueFrom(
      this.store.select(EventsSelectors.selectHasUnsavedChanges),
    );

    if (!hasUnsavedChanges) {
      return true;
    }

    const modal: Modal = {
      title: 'Unsaved changes',
      body: 'Are you sure you want to leave? Any unsaved changes to this event will be lost.',
      confirmButtonText: 'Leave',
    };

    const result = await this.dialogService.open({
      componentType: ModalComponent,
      inputs: { modal },
    });

    return result === 'confirm';
  }
}
