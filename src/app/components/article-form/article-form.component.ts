import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, first } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ImagesService } from '@app/services';
import type { Article } from '@app/types';
import { isDefined } from '@app/utils';
import { imageSizeValidator } from '@app/validators';

import { ArticleFormFacade } from './article-form.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  providers: [ArticleFormFacade],
})
export class ArticleFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    public facade: ArticleFormFacade,
    private formBuilder: FormBuilder,
    private imagesService: ImagesService,
  ) {}

  ngOnInit(): void {
    this.facade.formArticle$.pipe(filter(isDefined), first()).subscribe(article => {
      this.initForm(article);
      this.initValueChangesListener();
      this.initArticleImageRehydration();
    });
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidDateFormat')) {
      return 'Invalid date';
    } else if (control.hasError('imageTooLarge')) {
      return 'Banner image file must be smaller than 1MB';
    } else {
      return 'Unknown error';
    }
  }

  onCancel(): void {
    this.facade.onCancel();
  }

  onChooseImage(event: Event): void {
    const fileInputElement = event.target as HTMLInputElement;
    if (fileInputElement.files?.length) {
      const imageFile = fileInputElement.files[0];
      fileInputElement.value = '';

      this.imagesService.storeImageDataUrlInLocalStorage(imageFile);

      this.form.patchValue({
        imageFile,
        imageUrl: URL.createObjectURL(imageFile),
      });
    }
  }

  onRevert(): void {
    localStorage.removeItem('imageUrl');
    this.facade.onRevert();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.facade.onSubmit(this.form.value);
  }

  private initForm(article: Article): void {
    this.form = this.formBuilder.group({
      title: [article.title, [Validators.required, Validators.pattern(/[^\s]/)]],
      body: [article.body, [Validators.required, Validators.pattern(/[^\s]/)]],
      imageFile: [article.imageFile ?? null, [Validators.required, imageSizeValidator]],
      id: [article.id],
      imageId: [article.imageId],
      imageUrl: [article.imageUrl],
      thumbnailImageUrl: [article.thumbnailImageUrl],
      isSticky: [article.isSticky],
      modificationInfo: [article.modificationInfo],
    });
  }

  private initValueChangesListener(): void {
    this.form.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe((formData: Article) => this.facade.onValueChange(formData));
  }

  private initArticleImageRehydration(): void {
    this.facade.articleImageCurrently$.pipe(untilDestroyed(this)).subscribe(article => {
      this.form.patchValue(
        {
          imageFile: article.imageFile,
          imageUrl: article.imageUrl,
        },
        { emitEvent: false },
      );
    });
  }
}
