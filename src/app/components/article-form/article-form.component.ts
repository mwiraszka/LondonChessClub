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
  EditableArticle,
  Id,
  LccError,
  Url,
} from '@app/models';
import { DialogService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { dataUrlToFile, formatBytes, isDefined } from '@app/utils';
import { imageCaptionValidator } from '@app/validators';

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
  public originalBannerImageUrl: Url | null = null;

  private articleId: Id | null = null;
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
        if (article?.formData.id && !article.formData.presignedUrl) {
          this.store.dispatch(
            ImagesActions.fetchArticleBannerImageRequested({
              imageId: article.formData.id,
              setAsOriginal: true,
            }),
          );
        }

        this.articleId = article?.id ?? null;
        this.controlMode = controlMode;

        this.initForm(article?.formData);
        this.initFormValueChangeListener();
      });
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
    return control.hasError('required')
      ? 'This field is required'
      : control.hasError('invalidImageCaption')
        ? 'Image caption can only contain letters, numbers, and readable symbols'
        : control.hasError('pattern')
          ? 'Invalid text'
          : 'Unknown error';
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
        this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
        return;
      }

      if (imageFile.size > 4_194_304) {
        const error: LccError = {
          name: 'LCCError',
          message: `Image file must be under 4 MB. Selected image was ${formatBytes(imageFile.size)} after conversion.`,
        };
        this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
        return;
      }

      this.form?.patchValue({
        id: null,
        filename: imageFile.name,
        fileSize: imageFile.size,
        presignedUrl: dataUrl,
        caption: imageFile.name.substring(0, imageFile.name.lastIndexOf('.')),
      });
    };

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
    this.form?.patchValue({ id: null });
  }

  public onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  public async onSubmit(article?: EditableArticle | null): Promise<void> {
    if (!this.form || this.form.invalid || !article) {
      this.form?.markAllAsTouched();
      return;
    }

    const filename = this.form.value.filename;
    const uploadingNewImage = !!this.form.value.id;
    const verb = this.controlMode === 'edit' ? 'Update' : 'Publish';

    const dialog: Dialog = {
      title: `${verb} article ${uploadingNewImage ? ' & upload image' : ''}?`,
      body: `${verb} ${article.title}${
        uploadingNewImage ? ` and upload new image ${filename}` : ''
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

    if (!this.form.value.id) {
      this.store.dispatch(
        ImagesActions.addImageRequested({
          dataUrl: this.form.value.presignedUrl!,
          filename: this.form.value.filename!,
          caption: this.form.value.caption!,
          forArticle: true,
        }),
      );
    } else if (this.controlMode === 'edit') {
      this.store.dispatch(ArticlesActions.updateArticleRequested({ article }));
    } else {
      this.store.dispatch(ArticlesActions.publishArticleRequested());
    }
  }

  private initForm(formData?: ArticleFormData): void {
    this.form = this.formBuilder.group<ArticleFormGroup>({
      // Article form controls:
      title: new FormControl(formData?.title ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      body: new FormControl(formData?.body ?? '', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),

      // Banner image form controls:
      id: new FormControl(formData?.id ?? null),
      filename: new FormControl(formData?.filename ?? '', {
        nonNullable: true,
      }),
      fileSize: new FormControl(formData?.fileSize ?? 0, {
        nonNullable: true,
      }),
      presignedUrl: new FormControl(formData?.presignedUrl ?? '', {
        nonNullable: true,
      }),
      caption: new FormControl(formData?.caption ?? '', {
        nonNullable: true,
        validators: [Validators.required, imageCaptionValidator],
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
