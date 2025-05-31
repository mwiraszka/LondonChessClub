import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { FormErrorIconComponent } from '@app/components/form-error-icon/form-error-icon.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import type {
  BasicDialogResult,
  Dialog,
  Image,
  ImageFormData,
  ImageFormGroup,
  LccError,
  Url,
} from '@app/models';
import { DialogService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { dataUrlToFile } from '@app/utils';
import {
  imageCaptionValidator,
  oneAlbumMinimumValidator,
  uniqueAlbumValidator,
} from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-image-form',
  templateUrl: './image-form.component.html',
  styleUrl: './image-form.component.scss',
  imports: [
    CommonModule,
    FormErrorIconComponent,
    IconsModule,
    ImagePreloadDirective,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class ImageFormComponent implements OnInit {
  @Input({ required: true }) existingAlbums!: string[];
  @Input({ required: true }) formData!: ImageFormData;
  @Input({ required: true }) hasUnsavedChanges!: boolean;
  @Input({ required: true }) originalImage!: Image | null;

  public form!: FormGroup<ImageFormGroup>;

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.initForm(this.formData);
    this.initFormValueChangeListener();

    if (this.hasUnsavedChanges) {
      this.form.markAllAsTouched();
    }
  }

  public toggleAlbum(album: string): void {
    const selectedAlbums = this.form.controls.albums.value;
    const albums = selectedAlbums.includes(album)
      ? selectedAlbums.filter(selectedAlbum => selectedAlbum !== album)
      : [...selectedAlbums, album].sort();

    this.form.patchValue({ albums });
    this.form.controls.albums.markAsDirty();
  }

  public onUploadNewImage(event: Event): void {
    const fileInputElement = event.target as HTMLInputElement;
    const file = fileInputElement.files?.length ? fileInputElement.files[0] : null;

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

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
          message: 'Unable to load image file.',
        };
        this.store.dispatch(ImagesActions.imageFileLoadFailed({ error }));
        return;
      }

      // Display notice if file size is over 4 MB
      if (imageFile.size > 4_194_304) {
        this.store.dispatch(
          ImagesActions.largeImageFileDetected({ fileSize: imageFile.size }),
        );
      }

      this.form.patchValue({
        dataUrl,
        filename: imageFile.name,
        caption: imageFile.name.substring(0, file.name.lastIndexOf('.')),
      });
    };

    fileInputElement.value = '';
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
      body: this.originalImage
        ? `Update ${this.originalImage.filename}?`
        : `Add ${this.formData.filename}`,
      confirmButtonText: this.originalImage ? 'Update' : 'Add',
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

    if (this.originalImage) {
      this.store.dispatch(
        ImagesActions.updateImageRequested({ imageId: this.originalImage.id }),
      );
    } else {
      this.store.dispatch(ImagesActions.addImageRequested());
    }
  }

  private initForm(formData: ImageFormData): void {
    this.form = this.formBuilder.group<ImageFormGroup>(
      {
        filename: new FormControl(formData.filename, {
          nonNullable: true,
          validators: Validators.required,
        }),
        dataUrl: new FormControl(formData.dataUrl, {
          nonNullable: true,
          validators: Validators.required,
        }),
        caption: new FormControl(formData.caption, {
          nonNullable: true,
          validators: [Validators.required, imageCaptionValidator],
        }),
        albums: new FormControl(formData.albums, {
          nonNullable: true,
        }),
        newAlbum: new FormControl(formData.newAlbum, {
          nonNullable: true,
          validators: [
            Validators.pattern(/[^\s]/),
            uniqueAlbumValidator(this.existingAlbums),
          ],
        }),
      },
      {
        validators: oneAlbumMinimumValidator,
      },
    );
  }

  private initFormValueChangeListener(): void {
    this.form.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<ImageFormData>) => {
        // Manually transfer error to inner control to benefit from common error message handling
        this.form.controls.albums.setErrors(
          this.form.hasError('albumRequired') ? { albumRequired: true } : null,
        );

        this.store.dispatch(
          ImagesActions.formValueChanged({
            imageId: this.originalImage?.id ?? null,
            value,
          }),
        );
      });

    // Manually trigger form value change to pass initial form data to store
    this.form.updateValueAndValidity();
  }
}
