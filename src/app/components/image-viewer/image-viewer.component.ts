import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, switchMap, take } from 'rxjs';

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
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
  Id,
  Image,
} from '@app/models';
import { DialogService } from '@app/services';
import { ImagesActions, ImagesSelectors } from '@app/store/images';

@UntilDestroy()
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
export class ImageViewerComponent
  implements OnInit, AfterViewInit, OnDestroy, DialogOutput<null>
{
  @ViewChild(AdminControlsDirective) adminControlsDirective?: AdminControlsDirective;

  @Input({ required: true }) album!: string;
  @Input({ required: true }) images!: Image[];
  @Input({ required: true }) isAdmin!: boolean;

  @Output() public dialogResult = new EventEmitter<null | 'close'>();

  public currentImage$!: Observable<Image | null>;
  public displayedCaption: string = '';
  public isPreviousImageButtonActive = false;
  public isNextImageButtonActive = false;

  public get index(): number {
    return this.indexSubject.getValue();
  }

  public get imageId(): Id {
    return this.images[this.index].id;
  }

  private indexSubject = new BehaviorSubject<number>(0);

  constructor(
    private readonly dialogService: DialogService,
    private readonly renderer: Renderer2,
    private readonly store: Store,
  ) {}

  private keydownListener?: () => void;
  private keyupListener?: () => void;

  ngOnInit(): void {
    this.currentImage$ = this.indexSubject.asObservable().pipe(
      untilDestroyed(this),
      switchMap(index => {
        this.fetchImage(index);
        return this.store.select(ImagesSelectors.selectImageById(this.imageId));
      }),
    );

    this.prefetchAdjacentImages();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initKeyListeners());
  }

  ngOnDestroy(): void {
    this.keydownListener?.();
    this.keyupListener?.();
  }

  public onPreviousImage(): void {
    this.adminControlsDirective?.detach();
    const newIndex = this.index > 0 ? this.index - 1 : this.images.length - 1;
    this.indexSubject.next(newIndex);
  }

  public onNextImage(): void {
    this.adminControlsDirective?.detach();
    const newIndex = this.index < this.images.length - 1 ? this.index + 1 : 0;
    this.indexSubject.next(newIndex);
  }

  public getAdminControlsConfig(image: Image): AdminControlsConfig {
    return {
      buttonSize: 34,
      deleteCb: () => this.onDeleteImage(image),
      editPath: ['image', 'edit', image.id],
      editInNewTab: true,
      isDeleteDisabled: !!image?.articleAppearances,
      deleteDisabledReason: 'Image cannot be deleted while it is used in an article',
      itemName: image.filename,
    };
  }

  public async onDeleteImage(image: Image): Promise<void> {
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
      this.dialogResult.emit(null);
    }
  }

  private prefetchAdjacentImages(): void {
    if (this.images.length > 1) {
      // Immediate next image
      this.fetchImage(1);
    }

    if (this.images.length > 2) {
      // Immediate previous image (last index)
      this.fetchImage(this.images.length - 1);
    }

    if (this.images.length > 3) {
      // Fetch the rest with a delay to ensure browser prioritizes the first requests
      setTimeout(() => {
        for (let i = 2; i <= Math.floor(this.images.length / 2); i++) {
          this.fetchImage(i);
          // Avoid duplicate fetches when the middle is reached in odd-length arrays
          if (i !== this.images.length - i) {
            this.fetchImage(this.images.length - i);
          }
        }
      }, 100);
    }
  }

  private fetchImage(index: number): void {
    const imageId = this.images[index].id;

    this.store
      .select(ImagesSelectors.selectImageById(imageId))
      .pipe(take(1))
      .subscribe(image => {
        if (!image?.originalUrl) {
          this.store.dispatch(
            ImagesActions.fetchImageRequested({ imageId: this.imageId }),
          );
        }
      });
  }

  private initKeyListeners(): void {
    this.keydownListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (this.isPreviousImageButtonActive || this.isNextImageButtonActive) {
          return;
        }

        if (event.key === 'ArrowLeft' && this.images.length > 1) {
          this.isPreviousImageButtonActive = true;
          this.onPreviousImage();
        } else if (
          (event.key === 'ArrowRight' || event.key === ' ') &&
          this.images.length > 1
        ) {
          this.isNextImageButtonActive = true;
          this.onNextImage();
        }
      },
    );

    this.keyupListener = this.renderer.listen(
      'document',
      'keyup',
      (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft' && this.images.length > 1) {
          this.isPreviousImageButtonActive = false;
        } else if (
          (event.key === 'ArrowRight' || event.key === ' ') &&
          this.images.length > 1
        ) {
          this.isNextImageButtonActive = false;
        }
      },
    );
  }
}
