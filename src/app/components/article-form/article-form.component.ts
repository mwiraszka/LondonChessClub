import { Subscription } from 'rxjs';
import { debounceTime, first, tap } from 'rxjs/operators';

import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoaderService } from '@app/services';
import { Article } from '@app/types';

import { ArticleFormFacade } from './article-form.facade';

@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  providers: [ArticleFormFacade],
})
export class ArticleFormComponent {
  form!: FormGroup;
  valueChangesSubscription!: Subscription;

  constructor(
    public facade: ArticleFormFacade,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loader.display(true);

    this.facade.articleCurrently$
      .pipe(
        tap(article => this.initForm(article)),
        tap(() => this.loader.display(false)),
        first(),
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
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('invalidDateFormat')) {
      return 'Invalid date';
    } else {
      return 'Unknown error';
    }
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
