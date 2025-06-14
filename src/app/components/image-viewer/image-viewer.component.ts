import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import { BehaviorSubject, Observable, distinctUntilChanged, switchMap } from 'rxjs';

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
  private indexSubject = new BehaviorSubject<number>(0);

  constructor(
    private readonly dialogService: DialogService,
    private readonly renderer: Renderer2,
    private readonly store: Store,
  ) {}

  get imageId(): Id {
    return this.images[this.indexSubject.value].id;
  }

  private keyListener?: () => void;

  ngOnInit(): void {
    this.store.dispatch(ImagesActions.fetchImageRequested({ imageId: this.imageId }));
    this.currentImage$ = this.indexSubject.asObservable().pipe(
      untilDestroyed(this),
      switchMap(index =>
        this.store.select(ImagesSelectors.selectImageById(this.images[index]?.id)),
      ),
      distinctUntilChanged(isEqual),
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initKeyListener());
  }

  ngOnDestroy(): void {
    this.keyListener?.();
  }

  public onPreviousImage(): void {
    this.adminControlsDirective?.detach();
    const newIndex =
      this.indexSubject.value > 0 ? this.indexSubject.value - 1 : this.images.length - 1;
    this.indexSubject.next(newIndex);
    this.store.dispatch(ImagesActions.fetchImageRequested({ imageId: this.imageId }));
  }

  public onNextImage(): void {
    this.adminControlsDirective?.detach();
    const newIndex =
      this.indexSubject.value < this.images.length - 1 ? this.indexSubject.value + 1 : 0;
    this.indexSubject.next(newIndex);
    this.store.dispatch(ImagesActions.fetchImageRequested({ imageId: this.imageId }));
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

  private initKeyListener(): void {
    this.keyListener = this.renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft' && this.images.length > 1) {
          this.onPreviousImage();
        } else if (
          (event.key === 'ArrowRight' || event.key === ' ') &&
          this.images.length > 1
        ) {
          this.onNextImage();
        }
      },
    );
  }
}
