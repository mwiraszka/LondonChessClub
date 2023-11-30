import { Subscription } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoaderService } from '@app/services';
import { Article, Url } from '@app/types';
import { imageSizeValidator } from '@app/validators';

import { ArticleFormFacade } from './article-form.facade';

@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  providers: [ArticleFormFacade],
})
export class ArticleFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  valueChangesSubscription!: Subscription;
  previewImageUrl!: Url | null;

  constructor(
    public facade: ArticleFormFacade,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.display(true);
    this.facade.articleBeforeEdit$.pipe(first()).subscribe(article => {
      this.initForm(article);
      this.previewImageUrl = article.imageUrl ?? null;
      this.loaderService.display(false);
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription.unsubscribe();
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
      return 'Banner image must be smaller than 1MB';
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
    console.log(':: article being submitted', this.form.value);
    this.facade.onSubmit(this.form.value);
  }

  private initForm(article: Article): void {
    console.log(':: article being initialized', article);

    this.form = this.formBuilder.group({
      id: [article.id],
      title: [article.title, [Validators.required, Validators.pattern(/[^\s]/)]],
      body: [article.body, [Validators.required, Validators.pattern(/[^\s]/)]],
      imageFile: [article.imageFile, [Validators.required, imageSizeValidator]],
      imageId: [article.imageId],
      dateCreated: [article.dateCreated],
      dateEdited: [article.dateEdited],
    });

    // TODO: investigate why setErrors({ required: null }) doesn't work
    this.form.controls['imageFile'].patchValue({});

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((formData: Article) => this.facade.onValueChange(formData));
  }
}
