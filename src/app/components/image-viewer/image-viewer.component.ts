import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  DialogOutput,
  Image,
} from '@app/models';
import { DialogService } from '@app/services';
import { ImagesActions } from '@app/store/images';

@Component({
  selector: 'lcc-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
  imports: [
    AdminControlsDirective,
    CommonModule,
    IconsModule,
    ImagePreloadDirective,
    TooltipDirective,
  ],
})
export class ImageViewerComponent implements AfterViewInit, DialogOutput<null> {
  @ViewChild(AdminControlsDirective) adminControlsDirective?: AdminControlsDirective;

  @Input({ required: true }) images!: Image[];
  @Input({ required: true }) isAdmin!: boolean;
  @Input() index = 0;

  @Output() public dialogResult = new EventEmitter<null | 'close'>();

  constructor(
    private readonly dialogService: DialogService,
    private readonly renderer: Renderer2,
    private readonly store: Store,
  ) {}

  private keyListener?: () => void;

  ngAfterViewInit(): void {
    setTimeout(() => this.initKeyListener());
  }

  ngOnDestroy(): void {
    this.keyListener?.();
  }

  public onPreviousImage(): void {
    this.adminControlsDirective?.detach();
    this.index = this.index > 0 ? this.index - 1 : this.images.length - 1;
  }

  public onNextImage(): void {
    this.adminControlsDirective?.detach();
    this.index = this.index < this.images.length - 1 ? this.index + 1 : 0;
  }

  public getAdminControlsConfig(image: Image): AdminControlsConfig {
    return {
      buttonSize: 26,
      deleteCb: () => this.onDeleteImage(image),
      editPath: ['image', 'edit', image.id],
      editInNewTab: true,
      isDeleteDisabled: !!image?.articleAppearances,
      deleteDisabledReason: 'Image cannot be deleted while it is used in an article',
      itemName: image.filename,
    };
  }

  public async onDeleteImage(image: Image): Promise<void> {
    if (!image.id) {
      return;
    }

    const dialog: Dialog = {
      title: 'Delete image',
      body: `Delete ${image.filename}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        inputs: { dialog },
        isModal: true,
      },
    );

    if (result === 'confirm') {
      this.store.dispatch(ImagesActions.deleteImageRequested({ image }));
    }
  }

  private initKeyListener(): void {
    this.keyListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          this.onPreviousImage();
        } else if (event.key === 'ArrowRight' || event.key === ' ') {
          this.onNextImage();
        }
      },
    );
  }
}
