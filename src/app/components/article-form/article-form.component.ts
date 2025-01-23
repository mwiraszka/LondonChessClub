import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { pick } from 'lodash';
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
import { ImagePreloadDirective } from '@app/components/image-preload/image-preload.directive';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import type {
  Article,
  ArticleFormData,
  ArticleFormGroup,
  BasicDialogResult,
  ControlMode,
  Dialog,
  FileData,
  Id,
  LccError,
  Url,
} from '@app/models';
import { DialogService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { dataUrlToFile, formatBytes, isDefined } from '@app/utils';
import { filenameValidator } from '@app/validators';

import { newArticleFormTemplate } from './new-article-form-template';

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
  public isImageValidationActive: boolean = false;
  public originalBannerImageUrl: Url | null = null;

  private controlMode: ControlMode | null = null;

  constructor(
    // TODO: Find a way to remove generics from the service to allow for multiple component types
    // to be opened from a single host component but still maintaining type safety
    private readonly dialogService1: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly dialogService2: DialogService<ImageExplorerComponent, Id>,
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
      .subscribe(({ article, articleFormData, bannerImageUrl, controlMode }) => {
        this.handleBannerImage(bannerImageUrl, article);

        if (!articleFormData) {
          articleFormData = newArticleFormTemplate;

          // Copy over form-relevant properties from selected article
          // TODO: Generalize this and create a util function
          if (controlMode === 'edit' && article) {
            articleFormData = pick(
              article,
              Object.getOwnPropertyNames(articleFormData),
            ) as typeof articleFormData;
          }
        }

        this.controlMode = controlMode;

        this.initForm(articleFormData!);
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
      : control.hasError('invalidFilename')
        ? 'Filename can only contain letters, numbers, underscores and dashes'
        : 'Unknown error';
  }

  // Image file validation handled separately since it's not a form control;
  // and image filename validation handled separately since it should only validate
  // when a new image file is selected
  public get imageFileError(): string | null {
    if (this.controlMode === 'add' && !this.imageFileData && !this.form?.value.imageId) {
      return 'A banner image is required';
    }

    if (this.imageFileData && !this.form?.controls.imageFilename.value) {
      return 'A filename for the new image is required';
    }

    return null;
  }

  public onUploadNewImage(event: Event): void {
    const fileInputElement = event.target as HTMLInputElement;
    const file = fileInputElement.files?.length ? fileInputElement.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const dataUrl = reader.result as Url;
        const dotIndex = file.name.lastIndexOf('.');
        const imageFilename =
          file.name.substring(0, dotIndex).replaceAll(/[^a-zA-Z0-9-_]/g, '') ?? '';
        const fileData: FileData = {
          extension: file.name.substring(dotIndex),
          type: file.type,
        };

        const imageFile = dataUrlToFile(dataUrl, imageFilename, fileData);

        if (!imageFile) {
          const error: LccError = { message: 'Unable to load image file.' };
          this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
          return;
        }

        if (imageFile.size > 1_048_576) {
          const error: LccError = {
            message: `Image file must be under 1 MB. Selected image was ${formatBytes(imageFile.size)} after conversion.`,
          };
          this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
          return;
        }

        this.store.dispatch(ArticlesActions.bannerImageSet({ url: dataUrl, fileData }));
        this.form?.patchValue({ imageFilename });
      };
    }

    fileInputElement.value = '';
    this.isImageValidationActive = true;
  }

  public async onOpenImageExplorer(): Promise<void> {
    const thumbnailImageId = await this.dialogService2.open({
      componentType: ImageExplorerComponent,
    });

    if (thumbnailImageId) {
      const imageId = thumbnailImageId.split('-')[0];
      this.form?.patchValue({
        imageId,
        imageFilename: '',
      });
      this.store.dispatch(ImagesActions.fetchArticleBannerImageRequested({ imageId }));
      this.isImageValidationActive = true;
    }
  }

  public onRevertImage(originalImageId?: Id | null): void {
    this.form?.patchValue({
      imageId: originalImageId,
      imageFilename: '',
    });
    this.store.dispatch(ArticlesActions.bannerImageSet({ url: null, fileData: null }));
  }

  public onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  public async onSubmit(articleTitle?: string | null): Promise<void> {
    if (
      !this.form ||
      this.form.invalid ||
      this.imageFileError ||
      !isDefined(articleTitle)
    ) {
      this.form?.markAllAsTouched();
      this.isImageValidationActive = true;
      return;
    }

    const filename = this.form.controls.imageFilename.value;

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

    const result = await this.dialogService1.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result !== 'confirm') {
      return;
    }

    if (this.imageFileData) {
      this.store.dispatch(
        ImagesActions.addImageRequested({ filename, forArticle: true }),
      );
    } else if (this.controlMode === 'edit') {
      this.store.dispatch(ArticlesActions.updateArticleRequested({}));
    } else {
      this.store.dispatch(ArticlesActions.publishArticleRequested({}));
    }
  }

  private initForm(articleFormData: ArticleFormData): void {
    this.form = this.formBuilder.group<ArticleFormGroup>({
      imageId: new FormControl(articleFormData.imageId),
      imageFilename: new FormControl(articleFormData.imageFilename ?? '', {
        nonNullable: true,
        validators: [filenameValidator],
      }),
      title: new FormControl(articleFormData.title, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      body: new FormControl(articleFormData.body, {
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

  private handleBannerImage(bannerImageUrl: Url | null, article?: Article | null): void {
    if (!isDefined(bannerImageUrl) && isDefined(article?.imageId)) {
      this.store.dispatch(
        ImagesActions.fetchArticleBannerImageRequested({
          imageId: article.imageId,
          setAsOriginal: true,
        }),
      );
    }
  }
}
