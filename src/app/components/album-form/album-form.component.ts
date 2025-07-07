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
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import type {
  AlbumFormGroup,
  BasicDialogResult,
  Dialog,
  Id,
  Image,
  ImageFormData,
  ImageFormGroup,
  Url,
} from '@app/models';
import { DialogService, ImageFileService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { isLccError } from '@app/utils';
import { imageCaptionValidator } from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-album-form',
  templateUrl: './album-form.component.html',
  styleUrl: './album-form.component.scss',
  imports: [
    FormErrorIconComponent,
    ImagePreloadDirective,
    MatIconModule,
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

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly imageFileService: ImageFileService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    if (this.imageEntities.length) {
      this.store.dispatch(
        ImagesActions.fetchImagesRequested({
          imageIds: this.imageEntities.map(entity => entity.image.id),
        }),
      );
    }

    if (Object.keys(this.newImagesFormData).length) {
      this.fetchNewImageDataUrls();
    }

    this.initForm();
    this.initFormValueChangeListener();

    if (this.hasUnsavedChanges) {
      this.form.markAllAsDirty();
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

  public async onChooseFiles(event: Event): Promise<void> {
    const fileInputElement = event.target as HTMLInputElement;
    const files = fileInputElement.files;

    if (!files?.length) {
      return;
    }

    const processFiles = Array.from(files).map(async file => {
      const id = `new-${uuid.v4()}`;
      const result = await this.imageFileService.storeImageFile(id, file);

      if (isLccError(result)) {
        this.store.dispatch(ImagesActions.imageFileActionFailed({ error: result }));
      } else {
        const { dataUrl, filename } = result;

        this.newImageDataUrls[id] = dataUrl;

        const newImageFormGroup = this.formBuilder.group<Omit<ImageFormGroup, 'album'>>({
          id: new FormControl(id, { nonNullable: true }),
          filename: new FormControl(filename, { nonNullable: true }),
          caption: new FormControl(filename.substring(0, filename.lastIndexOf('.')), {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
          albumCover: new FormControl(false, { nonNullable: true }),
        });

        this.form.controls.newImages.push(newImageFormGroup);
      }
    });

    Promise.all(processFiles).then(() => {
      fileInputElement.value = '';
    });
  }

  public onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  public async onSubmit(album: string | null): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newImagesCount = this.form.controls.newImages.length;
    const dialog: Dialog = {
      title: 'Confirm',
      body:
        album && newImagesCount
          ? `Update ${album} and upload ${newImagesCount} images?`
          : album
            ? `Update ${album}?`
            : `Create new album and upload ${newImagesCount} images?`,
      confirmButtonText: album ? 'Update' : 'Create',
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

    if (album) {
      this.store.dispatch(ImagesActions.updateAlbumRequested({ album }));
    } else {
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
          id: new FormControl(entity.image.id, { nonNullable: true }),
          filename: new FormControl(entity.formData.filename, { nonNullable: true }),
          caption: new FormControl(entity.formData.caption, {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
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
