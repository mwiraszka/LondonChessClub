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
import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import type {
  Article,
  ArticleFormData,
  ArticleFormGroup,
  BasicDialogResult,
  Dialog,
  Id,
  Image,
} from '@app/models';
import { DialogService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';

@UntilDestroy()
@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
  imports: [
    CommonModule,
    FormErrorIconComponent,
    IconsModule,
    ImagePreloadDirective,
    MarkdownRendererComponent,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class ArticleFormComponent implements OnInit {
  @Input({ required: true }) bannerImage!: Image | null;
  @Input({ required: true }) formData!: ArticleFormData;
  @Input({ required: true }) hasUnsavedChanges!: boolean;
  @Input({ required: true }) originalArticle!: Article | null;

  public form!: FormGroup<ArticleFormGroup>;

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    if (
      !this.bannerImage &&
      (this.formData.bannerImageId || this.originalArticle?.bannerImageId)
    ) {
      this.store.dispatch(
        ImagesActions.fetchImageRequested({
          imageId: this.formData.bannerImageId ?? this.originalArticle!.bannerImageId!,
        }),
      );
    }

    this.initForm(this.formData);
    this.initFormValueChangeListener();

    if (this.hasUnsavedChanges) {
      this.form.markAllAsTouched();
    }
  }

  // public onUploadNewImage(event: Event): void {
  //   const fileInputElement = event.target as HTMLInputElement;
  //   const file = fileInputElement.files?.length ? fileInputElement.files[0] : null;

  //   if (!file) {
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   reader.onload = () => {
  //     const dataUrl = reader.result as Url;
  //     const sanitizedFilename =
  //       file.name
  //         .substring(0, file.name.lastIndexOf('.'))
  //         .replaceAll(/[^a-zA-Z0-9-_]/g, '') +
  //       file.name.substring(file.name.lastIndexOf('.'));

  //     const imageFile = dataUrlToFile(dataUrl, sanitizedFilename);

  //     if (!imageFile) {
  //       const error: LccError = {
  //         name: 'LCCError',
  //         message: 'Unable to load image file.',
  //       };
  //       this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
  //       return;
  //     }

  //     if (imageFile.size > 4_194_304) {
  //       const error: LccError = {
  //         name: 'LCCError',
  //         message: `Image file must be under 4 MB. Selected image was ${formatBytes(imageFile.size)} after conversion.`,
  //       };
  //       this.store.dispatch(ArticlesActions.bannerImageFileLoadFailed({ error }));
  //       return;
  //     }

  //     this.form.patchValue({
  //       id: null,
  //       filename: imageFile.name,
  //       fileSize: imageFile.size,
  //       presignedUrl: dataUrl,
  //       caption: imageFile.name.substring(0, imageFile.name.lastIndexOf('.')),
  //     });
  //   };

  //   fileInputElement.value = '';
  // }

  public async onOpenImageExplorer(): Promise<void> {
    const thumbnailImageId = await this.dialogService.open<ImageExplorerComponent, Id>({
      componentType: ImageExplorerComponent,
      isModal: true,
    });

    if (thumbnailImageId) {
      const imageId = thumbnailImageId.split('-')[0];
      this.form.patchValue({ bannerImageId: imageId });
      this.store.dispatch(ImagesActions.fetchImageRequested({ imageId }));
    }
  }

  public onRevertImage(): void {
    this.form.patchValue({ bannerImageId: this.originalArticle?.bannerImageId ?? '' });
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
      title: this.originalArticle ? 'Update article' : 'Publish article',
      body: this.originalArticle?.title
        ? `Update ${this.originalArticle.title}`
        : `Publish ${this.formData.title}`,
      confirmButtonText: this.originalArticle ? 'Update' : 'Add',
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

    if (this.originalArticle) {
      this.store.dispatch(
        ArticlesActions.updateArticleRequested({ articleId: this.originalArticle.id }),
      );
    } else {
      this.store.dispatch(ArticlesActions.publishArticleRequested());
    }
  }

  private initForm(formData: ArticleFormData): void {
    this.form = this.formBuilder.group<ArticleFormGroup>({
      title: new FormControl(formData.title, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      body: new FormControl(formData.body, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      bannerImageId: new FormControl(formData.bannerImageId, { nonNullable: true }),
    });
  }

  private initFormValueChangeListener(): void {
    this.form.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<ArticleFormData>) => {
        this.store.dispatch(
          ArticlesActions.formValueChanged({
            articleId: this.originalArticle?.id ?? null,
            value,
          }),
        );
      });

    // Manually trigger form value change to pass initial form data to store
    this.form.updateValueAndValidity();
  }
}
