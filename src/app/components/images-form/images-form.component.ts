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
      this.loadNewImageDataUrls();
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

  public onSetCoverImage(index: number): void {
    console.log(':: set cover image to', index);
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

        this.newImageDataUrls[filename] = dataUrl;

        const newImageFormGroup = this.formBuilder.group<
          Omit<ImageFormGroup, 'albums' | 'album'>
        >({
          id: new FormControl('', { nonNullable: true }),
          filename: new FormControl(filename, { nonNullable: true }),
          caption: new FormControl(filename.substring(0, filename.lastIndexOf('.')), {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
          coverForAlbum: new FormControl('', { nonNullable: true }),
        });

        this.form.controls.images.push(newImageFormGroup);
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

  private async loadNewImageDataUrls(): Promise<void> {
    const result = await this.imageFileService.getAllImages();

    if (isLccError(result)) {
      this.store.dispatch(ImagesActions.imageFileActionFailed({ error: result }));
    } else {
      this.newImageDataUrls = result.reduce(
        (acc, { filename, dataUrl }) => {
          acc[filename] = dataUrl;
          return acc;
        },
        {} as Record<string, Url>,
      );
    }
  }

  private async initForm(): Promise<void> {
    const imagesFormArray = new FormArray(
      this.imageEntities.map(entity =>
        this.formBuilder.group<Omit<ImageFormGroup, 'album' | 'albums'>>({
          id: new FormControl(entity.image.id, { nonNullable: true }),
          filename: new FormControl(entity.formData.filename, { nonNullable: true }),
          caption: new FormControl(entity.formData.caption, {
            nonNullable: true,
            validators: [Validators.required, imageCaptionValidator],
          }),
          coverForAlbum: new FormControl(entity.formData.coverForAlbum, {
            nonNullable: true,
          }),
        }),
      ),
    );

    const commonAlbums = [];
    if (this.imageEntities.length) {
      for (const album of this.existingAlbums) {
        if (this.imageEntities.every(entity => entity.image.albums.includes(album))) {
          commonAlbums.push(album);
        }
      }
    }

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
        images: imagesFormArray,
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

        // this.store.dispatch(
        //   ImagesActions.formValueChanged({ }),
        // );
      });

    // Manually trigger form value change to pass initial form data to store
    this.form.updateValueAndValidity();
  }
}
