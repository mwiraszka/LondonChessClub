import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';
import { dateValidator, mimeTypeValidator } from '@app/shared/validators';

import { ArticleEditorFacade } from './store/article-editor.facade';
import { Article } from '../types/article.model';

@Component({
  selector: 'lcc-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss'],
  providers: [ArticleEditorFacade],
})
export class ArticleEditorComponent implements OnInit, OnDestroy {
  readonly title = 'articleEditor';

  form!: FormGroup;
  imagePreview: string;
  valueChangesSubscription!: Subscription;

  constructor(
    public facade: ArticleEditorFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loader.display(true);

    this.facade.articleCurrently$
      .pipe(
        tap((article) => {
          this.initForm(article);
          this.imagePreview = article.headerImage as string;
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

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ headerImage: file });
    this.form.get('headerImage').updateValueAndValidity();

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
      headerImage: [article.headerImage, Validators.required, mimeTypeValidator],
      authorUserId: [article.authorUserId, Validators.required],
      dateCreated: [article.dateCreated, [Validators.required, dateValidator]],
      dateEdited: [article.dateEdited, [Validators.required, dateValidator]],
      body: [article.body, [Validators.required, Validators.pattern(/[^\s]/)]],
    });

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((formData: Article) => this.facade.onValueChange(formData));
  }
}
