import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import type { BasicDialogResult, Dialog } from '@app/models';
import { ArticleEditorPageComponent } from '@app/pages/article/article-editor/article-editor-page.component';
import { DialogService } from '@app/services';

@Injectable({ providedIn: 'root' })
export class UnsavedArticleGuard implements CanDeactivate<ArticleEditorPageComponent> {
  constructor(private readonly dialogService: DialogService) {}

  async canDeactivate(component: ArticleEditorPageComponent): Promise<boolean> {
    if (!component.hasUnsavedChanges) {
      return true;
    }

    const dialog: Dialog = {
      title: 'Unsaved changes',
      body: 'Are you sure you want to leave? Any unsaved changes to this article will be lost.',
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
