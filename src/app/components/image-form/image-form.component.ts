import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import * as uuid from 'uuid';

import { Component, Input, OnInit } from '@angular/core';
import {
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
import { INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import type {
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
    FormErrorIconComponent,
    ImagePreloadDirective,
    MatIconModule,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class ImageFormComponent implements OnInit {
  @Input({ required: true }) existingAlbums!: string[];
  @Input({ required: true }) hasUnsavedChanges!: boolean | null;
  @Input({ required: true }) imageEntity!: {
    image: Image;
    formData: ImageFormData;
  } | null;
  @Input({ required: true }) newImageFormData!: ImageFormData | null;

  public form!: FormGroup<ImageFormGroup>;
  public newImageDataUrl: Url | null = null;

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly imageFileService: ImageFileService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initFormValueChangeListener();

    if (this.hasUnsavedChanges) {
      this.form.markAllAsTouched();
    }

    if (this.newImageFormData) {
      this.fetchNewImageDataUrl(this.newImageFormData.id);
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

  public async onChooseFile(event: Event): Promise<void> {
    const fileInputElement = event.target as HTMLInputElement;
    const file = fileInputElement.files?.length ? fileInputElement.files[0] : null;

    if (file) {
      const id = `new-${uuid.v4()}`;
      const result = await this.imageFileService.storeImageFile(id, file, true);

      if (isLccError(result)) {
        this.store.dispatch(ImagesActions.imageFileActionFailed({ error: result }));
      } else {
        const { dataUrl, filename } = result;

        this.newImageDataUrl = dataUrl;
        this.form.patchValue({
          id,
          filename,
          caption: filename.substring(0, filename.lastIndexOf('.')),
        });
      }
    }

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
      body: this.imageEntity
        ? `Update ${this.imageEntity.image.filename}?`
        : `Add ${this.form.controls.filename.value}`,
      confirmButtonText: this.imageEntity ? 'Update' : 'Add',
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

    const imageId = this.form.controls.id.value;

    if (this.imageEntity) {
      this.store.dispatch(ImagesActions.updateImageRequested({ imageId }));
    } else {
      this.store.dispatch(ImagesActions.addImageRequested({ imageId }));
    }
  }

  private async fetchNewImageDataUrl(id: Id): Promise<void> {
    const result = await this.imageFileService.getImage(id);

    if (isLccError(result)) {
      this.store.dispatch(ImagesActions.imageFileActionFailed({ error: result }));
    } else if (result) {
      this.newImageDataUrl = result.dataUrl;
    }
  }

  private initForm(): void {
    const formData: ImageFormData = this.imageEntity?.formData ??
      this.newImageFormData ?? { ...INITIAL_IMAGE_FORM_DATA, id: `new-${uuid.v4()}` };

    this.form = this.formBuilder.group<ImageFormGroup>(
      {
        id: new FormControl(formData.id, {
          nonNullable: true,
        }),
        filename: new FormControl(formData.filename, {
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
        album: new FormControl(formData.album, {
          nonNullable: true,
          validators: [
            Validators.pattern(/[^\s]/),
            uniqueAlbumValidator(this.existingAlbums),
          ],
        }),
        coverForAlbum: new FormControl(formData.coverForAlbum, {
          nonNullable: true,
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
        if (this.form.hasError('albumRequired')) {
          this.form.controls.albums.setErrors({ albumRequired: true });
        } else {
          this.form.controls.albums.updateValueAndValidity({ emitEvent: false });
        }

        this.store.dispatch(
          ImagesActions.formValueChanged({ imageId: this.form.controls.id.value, value }),
        );
      });

    // Manually trigger form value change to pass initial form data to store
    this.form.updateValueAndValidity();
  }
}
