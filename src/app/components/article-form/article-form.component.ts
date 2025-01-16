import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { pick } from 'lodash';
import { debounceTime, filter, first } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
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
  ArticleFormData,
  ArticleFormGroup,
  BasicDialogResult,
  ControlMode,
  Dialog,
  Id,
  Url,
} from '@app/models';
import { DialogService, LocalStorageService } from '@app/services';
import { AppActions } from '@app/store/app';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { IMAGE_KEY, ImagesActions, ImagesSelectors } from '@app/store/images';
import { dataUrlToBlob, formatBytes, isDefined, isStorageSupported } from '@app/utils';

import { newArticleFormTemplate } from './new-article-form-template';

@UntilDestroy()
@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
  imports: [
    CommonModule,
    IconsModule,
    ImagePreloadDirective,
    MarkdownRendererComponent,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
})
export class ArticleFormComponent implements OnInit, OnDestroy {
  public readonly articleFormViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleFormViewModel,
  );
  public form: FormGroup<ArticleFormGroup<ArticleFormData>> | null = null;
  public imageFile: Blob | null = null;
  public imageValidationEnabled: boolean = false;
  public newImageUrl: Url | null = null;

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
    private readonly localStorageService: LocalStorageService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    if (!isStorageSupported) {
      this.store.dispatch(AppActions.localStorageDetectedUnsupported());
    }

    this.articleFormViewModel$
      .pipe(
        filter(({ controlMode }) => isDefined(controlMode)),
        first(({ article, controlMode }) =>
          controlMode === 'add' ? true : isDefined(article),
        ),
      )
      .subscribe(({ article, articleFormData, controlMode }) => {
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

        const imageDataUrl = this.localStorageService.get<string>(IMAGE_KEY);
        if (imageDataUrl) {
          const imageFile: Blob | null = dataUrlToBlob(imageDataUrl);
          if (imageFile) {
            this.setImageByFile(imageFile);
          }
        } else if (articleFormData!.imageId) {
          this.setImageById(articleFormData!.imageId);
        }
      });
  }

  ngOnDestroy(): void {
    this.updateStoredFile(null);
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public getErrorMessage(control: AbstractControl): string {
    return control.hasError('required') ? 'This field is required' : 'Unknown error';
    // Note: image file validation handled separately since it's not a form control
  }

  public get imageError(): string | null {
    if (!this.imageValidationEnabled) {
      return null;
    } else if (this.imageFile && this.imageFile.size > 1_048_576) {
      return `Image cannot exceed 1 MB (current image after conversion is
        ${formatBytes(this.imageFile.size)})`;
    } else if (
      this.controlMode === 'add' &&
      !(this.imageFile || this.form?.value['imageId'])
    ) {
      return 'This field is required';
    }
    return null;
  }

  public onUploadNewImage(event: Event): void {
    const fileInputElement = event.target as HTMLInputElement;

    if (fileInputElement.files?.length) {
      const reader = new FileReader();
      reader.readAsDataURL(fileInputElement.files[0]);
      fileInputElement.value = '';

      reader.onload = () => {
        const dataUrl = reader.result as Url;
        const imageFile = dataUrlToBlob(dataUrl);

        try {
          if (imageFile) {
            this.updateStoredFile(dataUrl);
            this.setImageByFile(imageFile);
          }
        } catch {
          const fileSize = formatBytes(imageFile!.size);
          this.store.dispatch(AppActions.localStorageDetectedFull({ fileSize }));
        }
      };
    }
  }

  public async onOpenImageExplorer(): Promise<void> {
    const thumbnailImageId = await this.dialogService2.open({
      componentType: ImageExplorerComponent,
    });

    if (thumbnailImageId) {
      this.setImageById(thumbnailImageId.slice(0, -8));
    }
  }

  public onRevertImage(originalImageId?: Id | null): void {
    this.form?.patchValue({ imageId: originalImageId });
    this.imageFile = null;
    this.newImageUrl = null;
    this.updateStoredFile(null);
  }

  public onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  public async onSubmit(articleTitle?: string | null): Promise<void> {
    if (this.form?.invalid || this.imageError || !isDefined(articleTitle)) {
      this.imageValidationEnabled = true;
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

    if (this.localStorageService.get(IMAGE_KEY)) {
      this.store.dispatch(ImagesActions.addImageRequested({ forArticle: true }));
    } else if (this.controlMode === 'edit') {
      this.store.dispatch(ArticlesActions.updateArticleRequested({}));
    } else {
      this.store.dispatch(ArticlesActions.publishArticleRequested({}));
    }
  }

  private initForm(articleFormData: ArticleFormData): void {
    this.form = this.formBuilder.group<ArticleFormGroup<ArticleFormData>>({
      imageId: new FormControl(articleFormData.imageId),
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

  private initFormValueChangeListener() {
    this.form?.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((value: Partial<ArticleFormData>) => {
        this.store.dispatch(ArticlesActions.formValueChanged({ value }));
      });

    // Manually trigger form value change to pass initial form data to store
    this.form?.updateValueAndValidity();
  }

  private setImageByFile(imageFile: Blob): void {
    this.imageValidationEnabled = true;
    this.form?.patchValue({ imageId: null });
    this.imageFile = imageFile;
    this.newImageUrl = URL.createObjectURL(imageFile);
  }

  private setImageById(imageId: Id): void {
    this.imageValidationEnabled = true;
    this.form?.patchValue({ imageId });
    this.imageFile = null;
    this.store
      .select(ImagesSelectors.selectImageById(imageId))
      .pipe(first(isDefined))
      .subscribe(image => (this.newImageUrl = image.presignedUrl));
    this.updateStoredFile(null);
  }

  private updateStoredFile(dataUrl: Url | null): void {
    if (dataUrl) {
      this.store.dispatch(
        AppActions.itemSetInLocalStorage({ key: IMAGE_KEY, item: dataUrl }),
      );
    } else {
      this.store.dispatch(AppActions.itemRemovedFromLocalStorage({ key: IMAGE_KEY }));
    }
  }
}
