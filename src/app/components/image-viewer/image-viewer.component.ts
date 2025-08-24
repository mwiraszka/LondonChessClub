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
import { MatIconModule } from '@angular/material/icon';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import {
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
    ImagePreloadDirective,
    MatIconModule,
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

  public ngOnInit(): void {
    this.currentImage$ = this.indexSubject.asObservable().pipe(
      untilDestroyed(this),
      switchMap(index => {
        this.fetchImage(index);
        return this.store.select(ImagesSelectors.selectImageById(this.imageId));
      }),
    );

    this.prefetchAdjacentImages();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.initKeyListeners());
  }

  public ngOnDestroy(): void {
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
      title: 'Confirm',
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
    if (this.images.length <= 1) {
      return;
    }

    // Immediate next image with a small delay
    setTimeout(() => this.fetchImage(1, true), 1000);

    if (this.images.length > 2) {
      // Previous image (last index) with a bigger delay
      setTimeout(() => this.fetchImage(this.images.length - 1, true), 2000);
    }

    if (this.images.length > 3) {
      // Stagger remaining prefetch requests to avoid overwhelming the browser
      let index = 0;
      const imagesToPrefetch: number[] = [];

      // Build a list of indices to prefetch, alternating between next and previous
      for (let i = 2; i <= Math.floor(this.images.length / 2); i++) {
        imagesToPrefetch.push(i);
        if (i !== this.images.length - i) {
          imagesToPrefetch.push(this.images.length - i);
        }
      }

      const prefetchNext = () => {
        if (index < imagesToPrefetch.length) {
          this.fetchImage(imagesToPrefetch[index], true);
          index++;
          setTimeout(prefetchNext, 1000);
        }
      };

      // Begin main prefetching process with a delay after the initial prefetches
      setTimeout(prefetchNext, 3000);
    }
  }

  private fetchImage(index: number, isPrefetch = false): void {
    if (index < 0 || index >= this.images.length) {
      return;
    }

    const imageId = this.images[index].id;

    this.store
      .select(ImagesSelectors.selectImageById(imageId))
      .pipe(take(1))
      .subscribe(image => {
        if (!image?.mainUrl) {
          this.store.dispatch(
            ImagesActions.fetchOriginalRequested({ imageId, isPrefetch }),
          );
        }
      });
  }

  private initKeyListeners(): void {
    this.keydownListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '];
        if (!navKeys.includes(event.key)) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

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
