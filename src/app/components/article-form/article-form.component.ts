import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '@app/services';
import { Article } from '@app/types';
import { dateValidator, mimeTypeValidator } from '@app/validators';

import { ArticleFormFacade } from './article-form.facade';

@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  providers: [ArticleFormFacade],
})
export class ArticleFormComponent {
  form!: FormGroup;
  imagePreview: string;
  valueChangesSubscription!: Subscription;

  constructor(
    public facade: ArticleFormFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader.display(true);

    this.facade.articleCurrently$
      .pipe(
        tap((article) => {
          this.initForm(article);
          this.imagePreview = article.headerImageUrl as string;
        }),
        first()
      )
      .subscribe();

    this.facade.articleBeforeEdit$
      .pipe(
        tap(() => this.loader.display(false)),
        first()
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription.unsubscribe();
  }

  hasError(control: AbstractControl): boolean {
    return control.value !== '' && control.invalid;
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.errors.hasOwnProperty('required')) {
      return 'This field is required';
    } else if (control.errors.hasOwnProperty('invalidDateFormat')) {
      return 'Invalid date';
    } else if (control.errors.hasOwnProperty('invalidMimeType')) {
      return "Invalid file type\n(Allowable formats: 'png' & 'jpg'";
    } else {
      return 'Unknown error';
    }
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.get('headerImageUrl').patchValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onCancel(): void {
    this.facade.onCancel();
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
      subtitle: [article.subtitle, [Validators.required, Validators.pattern(/[^\s]/)]],
      headerImageUrl: [article.headerImageUrl, Validators.required, mimeTypeValidator],
      authorId: [article.authorId, Validators.required],
      body: [article.body, [Validators.required, Validators.pattern(/[^\s]/)]],
      id: [article.id],
      dateCreated: [article.dateCreated],
      dateEdited: [article.dateEdited],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((formData: Article) => this.facade.onValueChange(formData));
  }
}
