import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { debounceTime, first } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { ImagePreloadDirective } from '@app/components/image-preload/image-preload.directive';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import { DialogService, ImagesService, LocalStorageService } from '@app/services';
import {
  ArticlesActions,
  ArticlesSelectors,
  LOCAL_STORAGE_IMAGE_KEY,
} from '@app/store/articles';
import { ToasterActions } from '@app/store/toaster';
import { ArticleFormData, ControlMode, Id, Url } from '@app/types';
import { dataUrlToBlob, formatBytes, isDefined, isStorageSupported } from '@app/utils';

import { DialogComponent } from '../dialog/dialog.component';

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
  public form: FormGroup | null = null;
  public imageFile: Blob | null = null;
  public imageValidationEnabled: boolean = false;
  public newImageUrl: Url | null = null;

  private readonly articleFormData$ = this.store.select(
    ArticlesSelectors.selectArticleFormData,
  );
  private readonly controlMode$ = this.store.select(ArticlesSelectors.selectControlMode);
  private controlMode: ControlMode | null = null;
  private dialogRef?: ComponentRef<DialogComponent<ImageExplorerComponent>>;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly imagesService: ImagesService,
    private readonly localStorageService: LocalStorageService,
    private readonly dialogService: DialogService<ImageExplorerComponent>,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    if (!isStorageSupported) {
      this.store.dispatch(ToasterActions.localStorageDetectedUnsupported());
    }

    this.controlMode$.pipe(first(isDefined)).subscribe(controlMode => {
      this.controlMode = controlMode;
    });

    this.articleFormData$.pipe(first(isDefined)).subscribe(articleFormData => {
      this.initForm(articleFormData);
      this.initFormValueChangeListener();

      const imageDataUrl = this.localStorageService.get<string>(LOCAL_STORAGE_IMAGE_KEY);
      if (imageDataUrl) {
        this.setImageByFile(dataUrlToBlob(imageDataUrl));
      } else if (articleFormData.imageId) {
        this.setImageById(articleFormData.imageId);
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
          this.updateStoredFile(dataUrl);
          this.setImageByFile(imageFile);
        } catch (error) {
          const fileSize = formatBytes(imageFile.size);
          this.store.dispatch(ToasterActions.localStorageDetectedFull({ fileSize }));
        }
      };
    }
  }

  public onOpenImageExplorer(): void {
    this.dialogRef = this.dialogService.open({ component: ImageExplorerComponent });
    this.dialogRef.instance.confirm.pipe(first()).subscribe((thumbnailImageId: Id) => {
      this.dialogService.close();
      const imageId = thumbnailImageId.slice(0, -8);
      this.setImageById(imageId);
    });
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

  public onSubmit(articleTitle?: string): void {
    if (this.form?.invalid || this.imageError || !articleTitle) {
      this.imageValidationEnabled = true;
      this.form?.markAllAsTouched();
      return;
    }

    // TODO: Simplify the modal/guard flow & have a single submission request action
    if (this.controlMode === 'edit') {
      this.store.dispatch(
        ArticlesActions.updateArticleSelected({
          articleTitle,
        }),
      );
    } else {
      this.store.dispatch(
        ArticlesActions.publishArticleSelected({
          articleTitle,
        }),
      );
    }
  }

  private initForm(articleFormData: ArticleFormData): void {
    this.form = this.formBuilder.group({
      imageId: [articleFormData.imageId],
      title: [articleFormData.title, [Validators.required, Validators.pattern(/[^\s]/)]],
      body: [articleFormData.body, [Validators.required, Validators.pattern(/[^\s]/)]],
      isSticky: [articleFormData.isSticky],
    });
  }

  private initFormValueChangeListener() {
    this.form?.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((articleFormData: ArticleFormData) => {
        this.store.dispatch(ArticlesActions.formDataChanged({ articleFormData }));
      });
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
    this.imagesService
      .getImage(imageId)
      .pipe(first())
      .subscribe(image => (this.newImageUrl = image.presignedUrl));
    this.updateStoredFile(null);
  }

  private updateStoredFile(dataUrl: Url | null): void {
    if (dataUrl) {
      this.localStorageService.set(LOCAL_STORAGE_IMAGE_KEY, dataUrl);
      this.store.dispatch(ArticlesActions.newImageStored());
    } else {
      this.localStorageService.remove(LOCAL_STORAGE_IMAGE_KEY);
      this.store.dispatch(ArticlesActions.storedImageRemoved());
    }
  }
}
