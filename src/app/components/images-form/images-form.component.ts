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
  BasicDialogResult,
  Dialog,
  Id,
  Image,
  ImageFormData,
  ImageFormGroup,
  MultiImageFormGroup,
  Url,
} from '@app/models';
import { DialogService, ImageFileService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { isLccError } from '@app/utils';
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
  @Input({ required: true }) existingAlbums!: string[];
  @Input({ required: true }) hasUnsavedChanges!: boolean | null;
  @Input({ required: true }) imageEntities!: {
    image: Image;
    formData: ImageFormData;
  }[];
  @Input({ required: true }) newImagesFormData!: Record<string, ImageFormData>;

  public form!: FormGroup<MultiImageFormGroup>;
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

  public onToggleAlbum(album: string): void {
    const selectedAlbums = this.form.controls.albums.value;
    const albums = selectedAlbums.includes(album)
      ? selectedAlbums.filter(selectedAlbum => selectedAlbum !== album)
      : [...selectedAlbums, album].sort();

    this.form.patchValue({ albums });
    this.form.controls.albums.markAsDirty();
  }

  public onSetCoverImage(id: Id): void {
    this.form.controls.existingImages.controls.forEach(control => {
      control.controls.coverForAlbum.setValue(
        control.value.id === id ? this.form.controls.album.value : '',
        { emitEvent: false },
      );
    });

    this.form.controls.newImages.controls.forEach(control => {
      control.controls.coverForAlbum.setValue(
        control.value.id === id ? this.form.controls.album.value : '',
        { emitEvent: false },
      );
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

        const newImageFormGroup = this.formBuilder.group<ImageFormGroup>({
          id: new FormControl(id, { nonNullable: true }),
          filename: new FormControl(filename, { nonNullable: true }),
          caption: new FormControl(filename.substring(0, filename.lastIndexOf('.')), {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
          albums: new FormControl(this.form.controls.albums.value, { nonNullable: true }),
          album: new FormControl(this.form.controls.album.value, { nonNullable: true }),
          coverForAlbum: new FormControl('', { nonNullable: true }),
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

    const dialog: Dialog = {
      title: 'Confirm',
      body: album ? `Update ${album}?` : 'Add images?',
      confirmButtonText: album ? 'Update' : 'Add',
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
    const commonAlbums: string[] = [];
    if (this.imageEntities.length) {
      for (const album of this.existingAlbums) {
        if (this.imageEntities.every(entity => entity.formData.albums.includes(album))) {
          commonAlbums.push(album);
        }
      }
    }

    const existingImagesFormArray = new FormArray(
      this.imageEntities.map(entity =>
        this.formBuilder.group<ImageFormGroup>({
          id: new FormControl(entity.image.id, { nonNullable: true }),
          filename: new FormControl(entity.formData.filename, { nonNullable: true }),
          caption: new FormControl(entity.formData.caption, {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
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
          coverForAlbum: new FormControl(entity.formData.coverForAlbum, {
            nonNullable: true,
          }),
        }),
      ),
    );

    const newImagesFormArray = new FormArray(
      Object.values(this.newImagesFormData).map(formData =>
        this.formBuilder.group<ImageFormGroup>({
          id: new FormControl(formData.id, { nonNullable: true }),
          filename: new FormControl(formData.filename, { nonNullable: true }),
          caption: new FormControl(formData.caption, {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
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
          coverForAlbum: new FormControl(formData.coverForAlbum, {
            nonNullable: true,
          }),
        }),
      ),
    );

    this.form = this.formBuilder.group<MultiImageFormGroup>(
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
        existingImages: existingImagesFormArray,
        newImages: newImagesFormArray,
      },
      {
        validators: oneAlbumMinimumValidator,
      },
    );
  }

  private initFormValueChangeListener(): void {
    this.form.valueChanges.pipe(debounceTime(250), untilDestroyed(this)).subscribe(() => {
      // Manually transfer error to inner control to benefit from common error message handling
      if (this.form.hasError('albumRequired')) {
        this.form.controls.albums.setErrors({ albumRequired: true });
      } else {
        this.form.controls.albums.updateValueAndValidity({ emitEvent: false });
      }

      const values: (Partial<ImageFormData> & { id: Id })[] = [
        ...Array.from(this.form.controls.existingImages.controls).map(control => ({
          ...(control as FormGroup<ImageFormGroup>).getRawValue(),
          album: this.form.controls.album.value,
          albums: this.form.controls.albums.value,
        })),
        ...Array.from(this.form.controls.newImages.controls).map(control => ({
          ...(control as FormGroup<ImageFormGroup>).getRawValue(),
          album: this.form.controls.album.value,
          albums: this.form.controls.albums.value,
        })),
      ];

      this.store.dispatch(ImagesActions.formValueChanged({ values }));
    });

    // Manually trigger form value change to pass initial form data to store
    this.form.updateValueAndValidity();
  }
}
