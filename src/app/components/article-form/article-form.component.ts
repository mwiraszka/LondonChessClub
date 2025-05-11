import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { debounceTime, filter, first } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import type {
  ArticleFormData,
  ArticleFormGroup,
  BasicDialogResult,
  ControlMode,
  Dialog,
  FileData,
  Id,
  Url,
} from '@app/models';
import { DialogService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { isDefined } from '@app/utils';
import { filenameValidator } from '@app/validators';

@UntilDestroy()
@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    IconsModule,
    ImagePreloadDirective,
    MarkdownRendererComponent,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class ArticleFormComponent implements OnInit {
  public readonly articleFormViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleFormViewModel,
  );
  public form: FormGroup<ArticleFormGroup> | null = null;
  public imageFileData: FileData | null = null;
  public originalBannerImageUrl: Url | null = null;

  private controlMode: ControlMode | null = null;

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.articleFormViewModel$
      .pipe(
        filter(({ controlMode }) => isDefined(controlMode)),
        first(({ article, controlMode }) =>
          controlMode === 'add' ? true : isDefined(article),
        ),
      )
      .subscribe(({ article, controlMode }) => {
        if (!article?.formData?.image?.presignedUrl && article?.image?.id) {
          this.store.dispatch(
            ImagesActions.fetchArticleBannerImageRequested({
              imageId: article.image.id,
              setAsOriginal: true,
            }),
          );
        }

        this.controlMode = controlMode;

        this.initForm(article?.formData);
        this.initFormValueChangeListener();
      });

    this.store
      .select(ArticlesSelectors.selectBannerImageFileData)
      .pipe(untilDestroyed(this))
      .subscribe(imageFileData => (this.imageFileData = imageFileData));
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
    return control.hasError('required')
      ? 'This field is required'
      : control.hasError('invalidImageFilename')
        ? 'Image filename can only contain letters, numbers, underscores and dashes'
        : 'Unknown error';
  }

  public onUploadNewImage(event: Event): void {
    const fileInputElement = event.target as HTMLInputElement;
    const file = fileInputElement.files?.length ? fileInputElement.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const dataUrl = reader.result as Url;

        console.log(':: dataUrl', dataUrl);
        console.log(':: file', file);

        // const dotIndex = file.name.lastIndexOf('.');
        // const imageFilename =
        //   file.name.substring(0, dotIndex).replaceAll(/[^a-zA-Z0-9-_]/g, '') ?? '';
        // const fileData: FileData = {
        //   extension: file.name.substring(dotIndex),
        //   type: file.type,
        // };

        // const imageFile = dataUrlToFile(dataUrl, file.name, fileData);

        // if (!imageFile) {
        //   const error: LccError = {
        //     name: 'LCCError',
        //     message: 'Unable to load image file.',
        //   };
        //   this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
        //   return;
        // }

        // if (imageFile.size > 4_194_304) {
        //   const error: LccError = {
        //     name: 'LCCError',
        //     message: `Image file must be under 4 MB. Selected image was ${formatBytes(imageFile.size)} after conversion.`,
        //   };
        //   this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
        //   return;
        // }

        // const image: Image = {
        //   id: '',
        //   articleAppearances: 1,
        //   filename: imageFilename,
        //   presignedUrl: dataUrl,
        //   fileSize: imageFile.size,
        // };

        // this.store.dispatch(ArticlesActions.bannerImageSet({ fileData }));
        // this.form?.patchValue({ image });
      };
    }

    fileInputElement.value = '';
  }

  public async onOpenImageExplorer(): Promise<void> {
    const thumbnailImageId = await this.dialogService.open<ImageExplorerComponent, Id>({
      componentType: ImageExplorerComponent,
      isModal: true,
    });

    if (thumbnailImageId) {
      const imageId = thumbnailImageId.split('-')[0];
      // this.form?.patchValue({ imageFilename: '' });
      this.store.dispatch(ImagesActions.fetchArticleBannerImageRequested({ imageId }));
    }
  }

  public onRevertImage(): void {
    this.form?.patchValue({ image: null });
    this.store.dispatch(ArticlesActions.bannerImageSet({ fileData: null }));
  }

  public onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  public async onSubmit(articleTitle?: string | null): Promise<void> {
    if (!this.form || this.form.invalid || !isDefined(articleTitle)) {
      this.form?.markAllAsTouched();
      return;
    }

    // const filename = this.form.controls.imageFilename.value;
    const filename = 'temp';

    const verb = this.controlMode === 'edit' ? 'Update' : 'Publish';
    const dialog: Dialog = {
      title: `${verb} article ${this.imageFileData ? ' & upload image' : ''}?`,
      body: `${verb} ${articleTitle}${
        this.imageFileData
          ? ` and upload new image ${filename}${this.imageFileData.extension}`
          : ''
      }?`,
      confirmButtonText: this.controlMode === 'edit' ? 'Update' : 'Add',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: { dialog },
      },
    );

    if (result !== 'confirm') {
      return;
    }

    if (this.imageFileData && this.form.value.image) {
      this.store.dispatch(
        ImagesActions.addImageRequested({
          image: this.form.value.image,
          forArticle: true,
        }),
      );
    } else if (this.controlMode === 'edit') {
      this.store.dispatch(ArticlesActions.updateArticleRequested({}));
    } else {
      this.store.dispatch(ArticlesActions.publishArticleRequested({}));
    }
  }

  private initForm(formData?: ArticleFormData | null): void {
    this.form = this.formBuilder.group<ArticleFormGroup>({
      image: new FormControl(formData?.image ?? null, {
        nonNullable: true,
        validators: [filenameValidator],
      }),
      title: new FormControl(formData?.title ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      body: new FormControl(formData?.body ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
    });
  }

  private initFormValueChangeListener(): void {
    this.form?.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<ArticleFormData>) => {
        this.store.dispatch(ArticlesActions.formValueChanged({ value }));
      });

    // Manually trigger form value change to pass initial form data to store
    this.form?.updateValueAndValidity();
  }
}
