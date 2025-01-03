import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { Injectable } from '@angular/core';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { DialogService } from '@app/services';
import { MembersSelectors } from '@app/store/members';
import type { BasicDialogResult, Dialog } from '@app/types';

@Injectable({ providedIn: 'root' })
export class UnsavedMemberGuard {
  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly store: Store,
  ) {}

  async canDeactivate(): Promise<boolean> {
    const hasUnsavedChanges = await firstValueFrom(
      this.store.select(MembersSelectors.selectHasUnsavedChanges),
    );

    if (!hasUnsavedChanges) {
      return true;
    }

    const dialog: Dialog = {
      title: 'Unsaved changes',
      body: 'Are you sure you want to leave? Any unsaved changes to this member will be lost.',
      confirmButtonText: 'Leave',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    return result === 'confirm';
  }
}
