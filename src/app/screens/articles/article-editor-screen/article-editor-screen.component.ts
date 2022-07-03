import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';
import { dateValidator, mimeTypeValidator } from '@app/shared/validators';

import { ArticleEditorScreenFacade } from './article-editor-screen.facade';
import { Article } from '../types/article.model';

@Component({
  selector: 'lcc-article-editor-screen',
  templateUrl: './article-editor-screen.component.html',
  styleUrls: ['./article-editor-screen.component.scss'],
  providers: [ArticleEditorScreenFacade],
})
export class ArticleEditorScreenComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  imagePreview: string;
  valueChangesSubscription!: Subscription;

  constructor(
    public facade: ArticleEditorScreenFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader.display(true);

    this.facade.articleCurrently$
      .pipe(
        tap((article) => {
          this.initForm(article);
          this.imagePreview = article.headerImagePath as string;
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
    this.form.get('headerImagePath').patchValue(file);

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
      headerImagePath: [article.headerImagePath, Validators.required, mimeTypeValidator],
      authorId: [article.authorId, Validators.required],
      dateCreated: [article.dateCreated, [Validators.required, dateValidator]],
      dateEdited: [article.dateEdited, dateValidator],
      body: [article.body, [Validators.required, Validators.pattern(/[^\s]/)]],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((formData: Article) => this.facade.onValueChange(formData));
  }
}
