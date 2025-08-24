import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import * as uuid from 'uuid';

import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { FormErrorIconComponent } from '@app/components/form-error-icon/form-error-icon.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import {
  AlbumFormGroup,
  BasicDialogResult,
  Dialog,
  Id,
  Image,
  ImageFormData,
  ImageFormGroup,
  ModificationInfo,
  Url,
} from '@app/models';
import { DialogService, ImageFileService } from '@app/services';
import { ImagesActions } from '@app/store/images';
import { isLccError } from '@app/utils';
import { imageCaptionValidator, ordinalityValidator } from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-album-form',
  templateUrl: './album-form.component.html',
  styleUrl: './album-form.component.scss',
  imports: [
    FormErrorIconComponent,
    ImagePreloadDirective,
    MatIconModule,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class AlbumFormComponent implements OnInit {
  @Input({ required: true }) album!: string | null;
  @Input({ required: true }) existingAlbums!: string[];
  @Input({ required: true }) hasUnsavedChanges!: boolean | null;
  @Input({ required: true }) imageEntities!: {
    image: Image;
    formData: ImageFormData;
  }[];
  @Input({ required: true }) newImagesFormData!: Record<string, ImageFormData>;

  public form!: FormGroup<AlbumFormGroup>;
  public newImageDataUrls: Record<string, Url> = {};

  public get mostRecentModificationInfo(): ModificationInfo | null {
    if (!this.imageEntities.length) {
      return null;
    }

    return this.imageEntities.reduce<ModificationInfo | null>((mostRecent, entity) => {
      const currentModInfo = entity.image.modificationInfo;

      if (!mostRecent) {
        return currentModInfo;
      }

      const mostRecentDate = new Date(mostRecent.dateLastEdited);
      const currentDate = new Date(currentModInfo.dateLastEdited);

      return currentDate > mostRecentDate ? currentModInfo : mostRecent;
    }, null);
  }

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly imageFileService: ImageFileService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.initForm();
    this.initFormValueChangeListener();

    if (this.imageEntities.length) {
      const imageIds = this.imageEntities
        .filter(entity => !entity.image.thumbnailUrl && !entity.image.mainUrl)
        .map(entity => entity.image.id);

      if (imageIds.length) {
        this.store.dispatch(ImagesActions.fetchBatchThumbnailsRequested({ imageIds }));
      }
    }

    if (Object.keys(this.newImagesFormData).length) {
      this.fetchNewImageDataUrls();
    }

    if (this.hasUnsavedChanges) {
      this.form.markAllAsTouched();
    }
  }

  public onSetAlbumCover(id: Id): void {
    this.form.controls.existingImages.controls.forEach(control => {
      control.controls.albumCover.setValue(control.value.id === id, { emitEvent: false });
    });

    this.form.controls.newImages.controls.forEach(control => {
      control.controls.albumCover.setValue(control.value.id === id, { emitEvent: false });
    });

    // Trigger a single form value change
    this.form.updateValueAndValidity();
  }

  public async onRemoveNewImage(
    image: Omit<ImageFormData, 'album'>,
    index: number,
  ): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm',
      body: `Remove ${image.filename}?`,
      confirmButtonText: 'Remove',
      confirmButtonType: 'warning',
    };

    const dialogResult = await this.dialogService.open<
      BasicDialogComponent,
      BasicDialogResult
    >({
      componentType: BasicDialogComponent,
      inputs: { dialog },
      isModal: false,
    });

    if (dialogResult !== 'confirm') {
      return;
    }

    const deleteResult = await this.imageFileService.deleteImage(image.id);
    if (isLccError(deleteResult)) {
      this.store.dispatch(ImagesActions.imageFileActionFailed({ error: deleteResult }));
    } else {
      this.form.controls.newImages.removeAt(index);
      delete this.newImageDataUrls[image.id];
      this.store.dispatch(ImagesActions.newImageRemoved({ imageId: image.id }));

      // Set album cover to the first available image
      if (image.albumCover) {
        const firstAvailableImage =
          this.form.controls.newImages.controls.find(
            control => !control.value.albumCover,
          ) ||
          this.form.controls.existingImages.controls.find(
            control => !control.value.albumCover,
          );

        if (firstAvailableImage) {
          firstAvailableImage.controls.albumCover.setValue(true);
        }
      }
    }
  }

  public async onChooseFiles(event: Event): Promise<void> {
    const fileInputElement = event.target as HTMLInputElement;
    const files = fileInputElement.files;

    if (!files?.length) {
      fileInputElement.value = '';
      return;
    }

    const totalNewImages = Object.keys(this.newImagesFormData).length + files.length;
    if (totalNewImages > 20) {
      this.store.dispatch(
        ImagesActions.imageFileActionFailed({
          error: {
            name: 'LCCError',
            message: `Only up to 20 images can be uploaded at a time`,
          },
        }),
      );
      fileInputElement.value = '';
      return;
    }

    let ordinalityCounter = 1;
    const processFiles = Array.from(files).map(async file => {
      const result = await this.imageFileService.storeImageFile(`new-${uuid.v4()}`, file);

      if (isLccError(result)) {
        this.store.dispatch(ImagesActions.imageFileActionFailed({ error: result }));
      } else {
        const { id, dataUrl, filename } = result;
        const isFirstImageInAlbum =
          !this.imageEntities.length && !Object.keys(this.newImageDataUrls).length;
        const albumOrdinality =
          this.imageEntities.length +
          Object.keys(this.newImagesFormData).length +
          +ordinalityCounter;

        const newImageFormGroup = this.formBuilder.group<Omit<ImageFormGroup, 'album'>>({
          id: new FormControl(id, { nonNullable: true }),
          filename: new FormControl(filename, { nonNullable: true }),
          caption: new FormControl(filename.substring(0, filename.lastIndexOf('.')), {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
          albumOrdinality: new FormControl(`${albumOrdinality}`, {
            nonNullable: true,
            validators: [Validators.required, ordinalityValidator],
          }),
          albumCover: new FormControl(isFirstImageInAlbum, { nonNullable: true }),
        });

        this.newImageDataUrls[id] = dataUrl;

        this.form.controls.newImages.push(newImageFormGroup);

        ordinalityCounter++;
      }
    });

    Promise.all(processFiles).then(() => {
      fileInputElement.value = '';
    });
  }

  public async onRestore(): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm',
      body: 'Restore original album data? All changes will be lost.',
      confirmButtonText: 'Restore',
      confirmButtonType: 'warning',
    };

    const dialogResult = await this.dialogService.open<
      BasicDialogComponent,
      BasicDialogResult
    >({
      componentType: BasicDialogComponent,
      inputs: { dialog },
      isModal: false,
    });

    if (dialogResult !== 'confirm') {
      return;
    }

    const imageIds = this.imageEntities.map(entity => entity.image.id);
    this.store.dispatch(ImagesActions.albumFormDataReset({ imageIds }));

    setTimeout(() => this.ngOnInit());
  }

  public onCancel(): void {
    this.store.dispatch(ImagesActions.cancelSelected());
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newImagesCount = this.form.controls.newImages.length;
    const thisOrThese = newImagesCount === 1 ? 'this' : 'these';
    const imageOrImages = newImagesCount === 1 ? 'image' : 'images';

    const body =
      this.album && newImagesCount
        ? `Update ${this.album} and upload ${thisOrThese} ${newImagesCount} new ${imageOrImages}?`
        : this.album
          ? `Update ${this.album}?`
          : `Create new album with ${thisOrThese} ${newImagesCount} new ${imageOrImages}?`;

    const dialog: Dialog = {
      title: 'Confirm',
      body,
      confirmButtonText: this.album ? 'Update' : 'Create',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        inputs: { dialog },
        isModal: false,
      },
    );

    if (result !== 'confirm') {
      return;
    }

    if (this.album) {
      this.store.dispatch(ImagesActions.updateAlbumRequested({ album: this.album }));
    }

    if (Object.keys(this.newImagesFormData).length) {
      this.store.dispatch(ImagesActions.addImagesRequested());
    }
  }

  private async fetchNewImageDataUrls(): Promise<void> {
    const result = await this.imageFileService.getAllImages();
    if (isLccError(result)) {
      this.store.dispatch(ImagesActions.imageFileActionFailed({ error: result }));
    } else {
      this.newImageDataUrls = result.reduce(
        (acc, { id, dataUrl }) => {
          acc[id] = dataUrl;
          return acc;
        },
        {} as Record<string, Url>,
      );
    }
  }

  private async initForm(): Promise<void> {
    const existingImagesFormArray = new FormArray(
      this.imageEntities.map(entity =>
        this.formBuilder.group<Omit<ImageFormGroup, 'album'>>({
          id: new FormControl(entity.formData.id, { nonNullable: true }),
          filename: new FormControl(entity.formData.filename, { nonNullable: true }),
          caption: new FormControl(entity.formData.caption, {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
          albumOrdinality: new FormControl(entity.formData.albumOrdinality, {
            nonNullable: true,
            validators: [Validators.required, ordinalityValidator],
          }),
          albumCover: new FormControl(entity.formData.albumCover, {
            nonNullable: true,
          }),
        }),
      ),
    );

    const newImagesFormArray = new FormArray(
      Object.values(this.newImagesFormData).map(formData =>
        this.formBuilder.group<Omit<ImageFormGroup, 'album'>>({
          id: new FormControl(formData.id, { nonNullable: true }),
          filename: new FormControl(formData.filename, { nonNullable: true }),
          caption: new FormControl(formData.caption, {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
          albumOrdinality: new FormControl(formData.albumOrdinality, {
            nonNullable: true,
            validators: [Validators.required, ordinalityValidator],
          }),
          albumCover: new FormControl(formData.albumCover, {
            nonNullable: true,
          }),
        }),
      ),
    );

    const albumValue = this.imageEntities.length
      ? this.imageEntities[0].formData.album
      : Object.keys(this.newImagesFormData).length
        ? Object.values(this.newImagesFormData)[0].album
        : (this.album ?? '');

    this.form = this.formBuilder.group<AlbumFormGroup>({
      album: new FormControl(albumValue, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      existingImages: existingImagesFormArray,
      newImages: newImagesFormArray,
    });
  }

  private initFormValueChangeListener(): void {
    this.form.valueChanges.pipe(debounceTime(250), untilDestroyed(this)).subscribe(() => {
      const values: (Partial<ImageFormData> & { id: Id })[] = [
        ...Array.from(this.form.controls.existingImages.controls).map(control => ({
          ...control.getRawValue(),
          album: this.form.controls.album.value,
        })),
        ...Array.from(this.form.controls.newImages.controls).map(control => ({
          ...control.getRawValue(),
          album: this.form.controls.album.value,
        })),
      ];

      this.store.dispatch(ImagesActions.formValueChanged({ values }));
    });

    // Manually trigger form value change to pass initial form data to store
    this.form.updateValueAndValidity();
  }
}
