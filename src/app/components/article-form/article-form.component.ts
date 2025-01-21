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
  Id,
  LccError,
  Url,
} from '@app/models';
import { DialogService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { dataUrlToBlob, formatBytes, isDefined } from '@app/utils';
import { fileNameValidator } from '@app/validators';

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
  public form: FormGroup<ArticleFormGroup<ArticleFormData>> | null = null;
  public imageFile: Blob | null = null;
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
      .subscribe(
        ({
          article,
          articleFormData,
          bannerImageUrl,
          originalBannerImageUrl,
          controlMode,
        }) => {
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
          this.originalBannerImageUrl = originalBannerImageUrl;

          this.initForm(articleFormData!);
          this.initFormValueChangeListener();
        },
      );
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
    return control.hasError('required')
      ? 'This field is required'
      : control.hasError('invalidFileName')
        ? 'File name can only contain letters, numbers, underscores and dashes'
        : 'Unknown error';
  }

  // Image file validation handled separately since it's not a form control
  public get imageFileError(): string | null {
    return this.controlMode === 'add' && !this.imageFile && !this.form?.value.imageId
      ? 'A banner image is required'
      : null;
  }

  public onUploadNewImage(event: Event): void {
    const fileInputElement = event.target as HTMLInputElement;
    const file = fileInputElement.files?.length ? fileInputElement.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const dataUrl = reader.result as Url;
        this.imageFile = dataUrlToBlob(dataUrl);

        if (!this.imageFile) {
          const error: LccError = { message: 'Unable to load image file.' };
          this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
          this.imageFile = null;
        } else if (this.imageFile.size > 1_048_576) {
          const fileSize = formatBytes(this.imageFile.size);
          const error: LccError = {
            message: `Image file must be under 1 MB. Selected image was ${fileSize} after conversion.`,
          };
          this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
          this.imageFile = null;
        } else {
          this.store.dispatch(ArticlesActions.bannerImageSet({ url: dataUrl }));
          const imageName =
            file?.name.replace(/\.[^/./]+$/, '').replaceAll(/[^a-zA-Z0-9-_]/g, '') ?? '';
          this.form?.patchValue({ imageName });
        }
      };
    }

    fileInputElement.value = '';
  }

  public async onOpenImageExplorer(): Promise<void> {
    const thumbnailImageId = await this.dialogService2.open({
      componentType: ImageExplorerComponent,
    });

    if (thumbnailImageId) {
      const imageId = thumbnailImageId.slice(0, -8);
      this.form?.patchValue({ imageId });
      this.store.dispatch(ImagesActions.fetchArticleBannerImageRequested({ imageId }));
      this.imageFile = null;
    }
  }

  public onRevertImage(originalImageId?: Id | null): void {
    this.form?.patchValue({ imageId: originalImageId });
    this.store.dispatch(ArticlesActions.bannerImageSet({ url: null }));
    this.imageFile = null;
  }

  public onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  public async onSubmit(
    bannerImageUrl: Url | null,
    articleTitle?: string | null,
  ): Promise<void> {
    if (this.form?.invalid || this.imageFileError || !isDefined(articleTitle)) {
      this.form?.markAllAsTouched();
      return;
    }

    const dialog: Dialog = {
      title:
        this.controlMode === 'edit' ? 'Confirm article update' : 'Confirm new article',
      body:
        this.controlMode === 'edit'
          ? `Update ${articleTitle}?`
          : `Publish ${articleTitle}?`,
      confirmButtonText: this.controlMode === 'edit' ? 'Update' : 'Add',
    };

    const result = await this.dialogService1.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result !== 'confirm') {
      return;
    }

    if (this.imageFile) {
      this.store.dispatch(
        ImagesActions.addImageRequested({
          dataUrl: bannerImageUrl!,
          forArticle: true,
        }),
      );
    } else if (this.controlMode === 'edit') {
      this.store.dispatch(ArticlesActions.updateArticleRequested({}));
    } else {
      this.store.dispatch(ArticlesActions.publishArticleRequested({}));
    }
  }

  private initForm(articleFormData: ArticleFormData): void {
    this.form = this.formBuilder.group<ArticleFormGroup<ArticleFormData>>({
      imageId: new FormControl(articleFormData.imageId),
      imageName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, fileNameValidator],
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
