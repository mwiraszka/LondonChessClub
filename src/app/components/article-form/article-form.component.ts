import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, first, take } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, ComponentRef, OnInit } from '@angular/core';
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
import { isDefined } from '@app/utils';
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
export class ArticleFormComponent implements OnInit {
  form: FormGroup | null = null;
  imageExplorerRef: ComponentRef<ImageExplorerComponent> | null = null;
  imageUrl: Url | null = null;
  originalImageId: Id | null = null;
  originalImageUrl: Url | null = null;

  constructor(
    public facade: ArticleFormFacade,
    private formBuilder: FormBuilder,
    private imagesService: ImagesService,
    private overlayService: OverlayService<ImageExplorerComponent>,
  ) {}

  ngOnInit(): void {
    this.facade.formArticle$.pipe(filter(isDefined), first()).subscribe(article => {
      this.originalImageId = article.imageId;
      this.originalImageUrl = article.imageUrl ?? null;
      this.imageUrl = article.imageUrl ?? null;
      this.initForm(article);
    });
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

  onCancel(): void {
    this.facade.onCancel();
  }

  onUploadNewImage(event: Event): void {
    const fileInputElement = event.target as HTMLInputElement;

    if (fileInputElement.files?.length) {
      const imageFile = fileInputElement.files[0];

      this.imageUrl = URL.createObjectURL(imageFile);
      this.form?.patchValue({
        imageId: null,
        imageFile,
      });
      fileInputElement.value = '';
    }
  }

  onOpenImageExplorer(): void {
    this.imageExplorerRef = this.overlayService.open(ImageExplorerComponent);

    this.imageExplorerRef.instance.selectImage
      .pipe(take(1))
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
    this.imageUrl = this.originalImageUrl;
    this.form?.patchValue({
      imageId: this.originalImageId,
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
      imageFile: [null, [imageSizeValidator]],
      isSticky: [article.isSticky],
      modificationInfo: [article.modificationInfo],
      id: [article.id],
    });

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
      .pipe(take(1))
      .subscribe(image => (this.imageUrl = image.presignedUrl));
  }
}
