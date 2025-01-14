import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import type { BasicDialogResult, Dialog } from '@app/models';
import { DialogService } from '@app/services';
import { EventsSelectors } from '@app/store/events';

@Injectable({ providedIn: 'root' })
export class UnsavedEventGuard implements CanDeactivate<unknown> {
  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly store: Store,
  ) {}

  async canDeactivate(): Promise<boolean> {
    const hasUnsavedChanges = await firstValueFrom(
      this.store.select(EventsSelectors.selectHasUnsavedChanges),
    );

    if (!hasUnsavedChanges) {
      return true;
    }

    const dialog: Dialog = {
      title: 'Unsaved changes',
      body: 'Are you sure you want to leave? Any unsaved changes to this event will be lost.',
      confirmButtonText: 'Leave',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    return result === 'confirm';
  }
}
