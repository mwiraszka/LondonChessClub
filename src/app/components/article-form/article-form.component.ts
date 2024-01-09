/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoaderService } from '@app/services';
import { Article, ModificationInfo, Url } from '@app/types';
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
  modificationInfo!: ModificationInfo | null;
  previewImageUrl!: Url | null;
  valueChangesSubscription!: Subscription;

  constructor(
    public facade: ArticleFormFacade,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.display(true);
    this.facade.articleBeforeEdit$.subscribe(article => {
      this.initForm(article);
      this.previewImageUrl = article.imageUrl ?? null;
      this.modificationInfo = article.modificationInfo;
      this.loaderService.display(false);
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
      this.form.patchValue({ imageFile: fileInputElement.files[0] });
      this.previewImageUrl = URL.createObjectURL(fileInputElement.files[0]);
      fileInputElement.value = '';
    }
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
      imageFile: [article.imageFile, [Validators.required, imageSizeValidator]],
      id: [article.id],
      imageId: [article.imageId],
      imageUrl: [article.imageUrl],
      thumbnailImageUrl: [article.thumbnailImageUrl],
      isSticky: [article.isSticky],
      modificationInfo: [article.modificationInfo],
    });

    // TODO: investigate why setErrors({ required: null }) doesn't work
    this.form.controls['imageFile'].patchValue({});

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200), untilDestroyed(this))
      .subscribe((formData: Article) => this.facade.onValueChange(formData));
  }
}
