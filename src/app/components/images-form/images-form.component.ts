import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { debounceTime, take } from 'rxjs/operators';

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
  BasicDialogResult,
  Dialog,
  Image,
  ImageFormData,
  ImageItemFormGroup,
  ImagesFormGroup,
  LccError,
  Url,
} from '@app/models';
import { DialogService, IndexedDbService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { dataUrlToFile, formatBytes } from '@app/utils';
import {
  imageCaptionValidator,
  oneAlbumMinimumValidator,
  uniqueAlbumValidator,
} from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-images-form',
  templateUrl: './images-form.component.html',
  styleUrl: './images-form.component.scss',
  imports: [
    FormErrorIconComponent,
    ImagePreloadDirective,
    MatIconModule,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class ImagesFormComponent implements OnInit {
  @Input({ required: true }) album!: string | null;
  @Input({ required: true }) albumImageEntities!: {
    image: Image;
    formData: ImageFormData;
  }[];
  @Input({ required: true }) existingAlbums!: string[];
  @Input({ required: true }) hasUnsavedChanges!: boolean;

  public form!: FormGroup<ImagesFormGroup>;
  public imagesFormArray!: FormArray<FormGroup<ImageItemFormGroup>>;

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly indexedDbService: IndexedDbService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    if (this.albumImageEntities.length) {
      this.store.dispatch(
        ImagesActions.fetchImagesRequested({
          imageIds: this.albumImageEntities.map(entity => entity.image.id),
        }),
      );
    }

    this.initForm();
    this.initFormValueChangeListener();

    if (this.hasUnsavedChanges) {
      this.form.markAllAsDirty();
    }

    this.loadImagesFromIndexedDb();
  }

  private loadImagesFromIndexedDb(): void {
    this.indexedDbService
      .getAllImages()
      .pipe(take(1))
      .subscribe(images => {
        if (images.length === 0) {
          return;
        }

        // Add images from IndexedDB to the form
        images.forEach(image => {
          const newImageFormGroup = this.formBuilder.group<ImageItemFormGroup>({
            id: new FormControl('', { nonNullable: true }),
            filename: new FormControl(image.filename, { nonNullable: true }),
            dataUrl: new FormControl(image.dataUrl, { nonNullable: true }),
            caption: new FormControl(image.caption, {
              nonNullable: true,
              validators: [Validators.required, imageCaptionValidator],
            }),
          });

          this.imagesFormArray.push(newImageFormGroup);

          // Add empty object to albumImageEntities to match FormArray length
          this.albumImageEntities.push({
            image: {} as Image,
            formData: image,
          });
        });
      });
  }

  public toggleAlbum(album: string): void {
    const selectedAlbums = this.form.controls.albums.value;
    const albums = selectedAlbums.includes(album)
      ? selectedAlbums.filter(selectedAlbum => selectedAlbum !== album)
      : [...selectedAlbums, album].sort();

    this.form.patchValue({ albums });
    this.form.controls.albums.markAsDirty();
  }

  public onChooseFiles(event: Event): void {
    const fileInputElement = event.target as HTMLInputElement;
    const files = fileInputElement.files;

    if (!files?.length) {
      return;
    }

    const processFiles = Array.from(files).map(file => {
      return new Promise<void>(resolve => {
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type.toLowerCase())) {
          const error: LccError = {
            name: 'LCCError',
            message: 'Sorry Ryan, currently only PNG or JPEG image formats are supported',
          };
          this.store.dispatch(ImagesActions.imageFileLoadFailed({ error }));
          resolve();
          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          const dataUrl = reader.result as Url;

          const sanitizedFilename =
            file.name
              .substring(0, file.name.lastIndexOf('.'))
              .replaceAll(/[^a-zA-Z0-9-_]/g, '') +
            file.name.substring(file.name.lastIndexOf('.'));

          const imageFile = dataUrlToFile(dataUrl, sanitizedFilename);

          if (!imageFile) {
            const error: LccError = {
              name: 'LCCError',
              message: 'Unable to load image file',
            };
            this.store.dispatch(ImagesActions.imageFileLoadFailed({ error }));
            resolve();
            return;
          }

          if (imageFile.size > 1_258_291) {
            const error: LccError = {
              name: 'LCCError',
              message: `Image is too large (${formatBytes(imageFile.size)}) - please reduce to below 1.2 MB`,
            };
            this.store.dispatch(ImagesActions.imageFileLoadFailed({ error }));
            resolve();
            return;
          }

          const caption = file.name.substring(0, file.name.lastIndexOf('.'));
          const imageData = {
            id: '',
            filename: imageFile.name,
            dataUrl,
            caption,
          };

          const newImageFormGroup = this.formBuilder.group<ImageItemFormGroup>({
            id: new FormControl(imageData.id, { nonNullable: true }),
            filename: new FormControl(imageData.filename, { nonNullable: true }),
            dataUrl: new FormControl(imageData.dataUrl, { nonNullable: true }),
            caption: new FormControl(imageData.caption, {
              nonNullable: true,
              validators: [Validators.required, imageCaptionValidator],
            }),
          });

          this.imagesFormArray.push(newImageFormGroup);

          this.albumImageEntities.push({
            image: {} as Image,
            formData: {
              filename: imageData.filename,
              caption: imageData.caption,
              dataUrl: imageData.dataUrl,
              albums: [],
              album: '',
            },
          });

          this.form.updateValueAndValidity();

          this.indexedDbService
            .storeImage({
              filename: imageData.filename,
              dataUrl: imageData.dataUrl,
              caption: imageData.caption,
              albums: [],
              album: this.album ?? '',
            })
            .pipe(take(1))
            .subscribe();
        };

        reader.onerror = () => {
          const error: LccError = {
            name: 'LCCError',
            message: 'Error reading file',
          };
          this.store.dispatch(ImagesActions.imageFileLoadFailed({ error }));
          resolve();
        };

        // Start reading the file
        reader.readAsDataURL(file);
      });
    });

    // When all files are processed, reset the file input
    Promise.all(processFiles).then(() => {
      fileInputElement.value = '';

      setTimeout(() => {
        // Re-render the form to ensure all images are displayed
        this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      }, 0);
    });
  }

  public onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dialog: Dialog = {
      title: 'Confirm',
      body: this.album ? `Update ${this.album}?` : 'Add images?',
      confirmButtonText: this.album ? 'Update' : 'Add',
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

    // TODO: Sent separate request to update album cover if it has changed
    // const albumCover = this.form.controls.albumCover.value;

    if (this.album) {
      const imageIds = this.imagesFormArray.controls.map(control => control.value.id!);
      this.store.dispatch(ImagesActions.updateImagesRequested({ imageIds }));
    } else {
      this.store.dispatch(ImagesActions.addImagesRequested());
    }
  }

  private initForm(): void {
    this.imagesFormArray = new FormArray(
      this.albumImageEntities.map(entity =>
        this.formBuilder.group<ImageItemFormGroup>({
          id: new FormControl(entity.image.id, { nonNullable: true }),
          filename: new FormControl(entity.formData.filename, { nonNullable: true }),
          dataUrl: new FormControl(entity.formData.dataUrl, { nonNullable: true }),
          caption: new FormControl(entity.formData.caption, {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
        }),
      ),
    );

    // All the albums that every one of the images belong to, apart from this one
    const commonAlbums = [];
    if (this.albumImageEntities.length) {
      for (const album of this.existingAlbums) {
        if (
          this.albumImageEntities.every(entity => entity.image.albums.includes(album))
        ) {
          commonAlbums.push(album);
        }
      }
    }

    // Get current cover image if it exists in the album images
    const albumCover =
      this.albumImageEntities.find(entity => entity.image.coverForAlbum === this.album)
        ?.image.id || '';

    this.form = this.formBuilder.group<ImagesFormGroup>(
      {
        album: new FormControl(this.album ?? '', {
          nonNullable: true,
          validators: [
            Validators.pattern(/[^\s]/),
            uniqueAlbumValidator(this.existingAlbums),
          ],
        }),
        albums: new FormControl(
          commonAlbums.filter(album => album !== this.album),
          {
            nonNullable: true,
          },
        ),
        albumCover: new FormControl(albumCover, {
          nonNullable: true,
        }),
        images: this.imagesFormArray,
      },
      {
        validators: oneAlbumMinimumValidator,
      },
    );
  }

  private initFormValueChangeListener(): void {
    this.form.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe(value => {
        // Manually transfer error to inner control to benefit from common error message handling
        if (this.form.hasError('albumRequired')) {
          this.form.controls.albums.setErrors({ albumRequired: true });
        } else {
          this.form.controls.albums.updateValueAndValidity({ emitEvent: false });
        }

        // Extract albums from main form
        const albums = value.albums?.length ? value.albums : [];
        if (value.album) {
          albums.push(value.album);
        }

        // For each image in the form array, dispatch an action with its values and shared albums
        const imagesArray = this.form.get('images') as FormArray;
        imagesArray.controls.forEach(imageControl => {
          const imageFormValue = imageControl.value;
          const imageId = imageFormValue.imageId;

          this.store.dispatch(
            ImagesActions.formValueChanged({
              imageId,
              value: {
                filename: imageFormValue.filename,
                caption: imageFormValue.caption,
                dataUrl: imageFormValue.dataUrl,
                albums,
              },
            }),
          );
        });
      });

    // Manually trigger form value change to pass initial form data to store
    this.form.updateValueAndValidity();
  }
}
