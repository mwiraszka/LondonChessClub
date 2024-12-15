import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatestWith, debounceTime, filter, first } from 'rxjs/operators';

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
import { ImagesService, OverlayService } from '@app/services';
import type { Article, Id, Url } from '@app/types';
import { dataUrlToFile, isDefined } from '@app/utils';
import { imageSizeValidator } from '@app/validators';

import { ArticleFormFacade } from './article-form.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  providers: [ArticleFormFacade],
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
  private readonly LOCAL_STORAGE_IMAGE_KEY = 'lcc-article-image';

  public form: FormGroup | null = null;

  private imageExplorerRef: ComponentRef<ImageExplorerComponent> | null = null;
  private originalImageId: Id | null = null;
  private originalImageUrl: Url | null = null;

  constructor(
    public facade: ArticleFormFacade,
    private formBuilder: FormBuilder,
    private imagesService: ImagesService,
    private overlayService: OverlayService<ImageExplorerComponent>,
  ) {}

  ngOnInit(): void {
    this.facade.controlMode$
      .pipe(
        filter(isDefined),
        combineLatestWith(
          this.facade.formArticle$,
          this.facade.setArticle$.pipe(filter(isDefined)),
        ),
        first(),
      )
      .subscribe(([controlMode, formArticle, setArticle]) => {
        if (!formArticle) {
          formArticle = setArticle;
        }

        this.originalImageId = setArticle.imageId;
        this.originalImageUrl = setArticle.imageUrl;
        this.initForm(formArticle);

        if (controlMode === 'edit' && !formArticle.imageId) {
          const dataUrl = localStorage.getItem(this.LOCAL_STORAGE_IMAGE_KEY);

          if (dataUrl) {
            (async () => {
              const imageFile = await dataUrlToFile(dataUrl);
              this.patchFormWithImageFile(imageFile);
            })();
          }
        }
      });
  }

  ngOnDestroy(): void {
    localStorage.removeItem(this.LOCAL_STORAGE_IMAGE_KEY);
  }

  hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('imageTooLarge')) {
      return 'Image size must be under 1 MB';
    } else {
      return 'Unknown error';
    }
  }

  async onUploadNewImage(event: Event): Promise<void> {
    const fileInputElement = event.target as HTMLInputElement;

    if (fileInputElement.files?.length) {
      const imageFile = fileInputElement.files[0];
      fileInputElement.value = '';

      this.patchFormWithImageFile(imageFile);

      // Serialize file object by converting to a base-64 string
      // so that a new URL can be generated on page reload
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        const dataUrl = reader.result;
        if (typeof dataUrl === 'string') {
          localStorage.setItem(this.LOCAL_STORAGE_IMAGE_KEY, dataUrl);
        }
      };
    }
  }

  onOpenImageExplorer(): void {
    this.imageExplorerRef = this.overlayService.open(ImageExplorerComponent);

    this.imageExplorerRef.instance.selectImage
      .pipe(first())
      .subscribe((thumbnailImageId: Id) => {
        this.overlayService.close();

        const imageId = thumbnailImageId.slice(0, -8);
        this.form?.patchValue({
          imageId,
          imageFile: null,
        });
        this.setImageUrl(imageId);
      });
  }

  onRevertImage(): void {
    this.form?.patchValue({
      imageId: this.originalImageId,
      imageUrl: this.originalImageUrl,
      imageFile: null,
    });
  }

  onSubmit(): void {
    if (!this.form || this.form?.invalid) {
      this.form?.markAllAsTouched();
      return;
    }

    const formData: Article & { imageFile: File } = this.form.value;
    const { imageFile, ...article } = formData;
    this.facade.onSubmit(article, imageFile);
  }

  private initForm(article: Article): void {
    this.form = this.formBuilder.group({
      title: [article.title, [Validators.required, Validators.pattern(/[^\s]/)]],
      body: [article.body, [Validators.required, Validators.pattern(/[^\s]/)]],
      imageId: [article.imageId],
      imageUrl: [article.imageUrl],
      imageFile: [null, [imageSizeValidator]],
      isSticky: [article.isSticky],
      modificationInfo: [article.modificationInfo],
      id: [article.id],
    });

    // Keep control dirty to enable validation on the hidden input
    this.form.controls['imageFile'].markAsDirty();

    this.form.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((formData: Article & { imageFile: File }) => {
        const { imageFile, ...article } = formData;
        this.facade.onValueChange(article);
      });
  }

  private setImageUrl(id: Id): void {
    this.imagesService
      .getImage(id)
      .pipe(first())
      .subscribe(image => this.form?.patchValue({ imageUrl: image.presignedUrl }));
  }

  private patchFormWithImageFile(imageFile: File): void {
    this.form?.patchValue({
      imageId: null,
      imageUrl: URL.createObjectURL(imageFile),
      imageFile,
    });
  }
}
