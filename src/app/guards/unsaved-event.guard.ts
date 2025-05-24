import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import type { BasicDialogResult, Dialog } from '@app/models';
import { EventEditorPageComponent } from '@app/pages/event/event-editor/event-editor-page.component';
import { DialogService } from '@app/services';

@Injectable({ providedIn: 'root' })
export class UnsavedEventGuard implements CanDeactivate<unknown> {
  constructor(private readonly dialogService: DialogService) {}

  async canDeactivate(component: EventEditorPageComponent): Promise<boolean> {
    const hasUnsavedChanges =
      component.viewModel$ &&
      (await firstValueFrom(component.viewModel$?.pipe(map(vm => vm.hasUnsavedChanges))));

    if (!hasUnsavedChanges) {
      return true;
    }

    const dialog: Dialog = {
      title: 'Unsaved changes',
      body: 'Are you sure you want to leave? Any unsaved changes to this event will be lost.',
      confirmButtonText: 'Leave',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: { dialog },
      },
    );

    return result === 'confirm';
  }
}
