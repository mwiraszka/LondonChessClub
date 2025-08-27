import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { FormErrorIconComponent } from '@app/components/form-error-icon/form-error-icon.component';
import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { ModificationInfoComponent } from '@app/components/modification-info/modification-info.component';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import {
  Article,
  ArticleFormData,
  ArticleFormGroup,
  BasicDialogResult,
  Dialog,
  Id,
  Image,
} from '@app/models';
import { DialogService } from '@app/services';

@UntilDestroy()
@Component({
  selector: 'lcc-article-form',
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
  imports: [
    FormErrorIconComponent,
    ImagePreloadDirective,
    MatIconModule,
    MarkdownRendererComponent,
    ModificationInfoComponent,
    ReactiveFormsModule,
    TooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleFormComponent implements OnInit {
  @Input({ required: true }) bannerImage!: Image | null;
  @Input({ required: true }) formData!: ArticleFormData;
  @Input({ required: true }) hasUnsavedChanges!: boolean;
  @Input({ required: true }) originalArticle!: Article | null;

  @Output() cancel = new EventEmitter<void>();
  @Output() change = new EventEmitter<{
    articleId: Id | null;
    formData: Partial<ArticleFormData>;
  }>();
  @Output() requestFetchMainImage = new EventEmitter<Id>();
  @Output() requestPublishArticle = new EventEmitter<void>();
  @Output() requestUpdateArticle = new EventEmitter<Id>();
  @Output() restore = new EventEmitter<Id | null>();

  public form!: FormGroup<ArticleFormGroup>;

  constructor(
    private readonly dialogService: DialogService,
    private readonly formBuilder: FormBuilder,
  ) {}

  public ngOnInit(): void {
    if (!this.bannerImage && this.formData.bannerImageId) {
      this.requestFetchMainImage.emit(this.formData.bannerImageId);
    }

    this.initForm();
    this.initFormValueChangeListener();

    if (this.hasUnsavedChanges) {
      this.form.markAllAsTouched();
    }
  }

  public async onRestore(): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm',
      body: 'Restore original article data? All changes will be lost.',
      confirmButtonText: 'Restore',
      confirmButtonType: 'warning',
    };

    const dialogResult = await this.dialogService.open<
      BasicDialogComponent,
      BasicDialogResult
    >({
      componentType: BasicDialogComponent,
      inputs: { dialog },
      isModal: false,
    });

    if (dialogResult !== 'confirm') {
      return;
    }

    this.restore.emit(this.originalArticle?.id ?? null);

    setTimeout(() => this.ngOnInit());
  }

  public async onOpenImageExplorer(): Promise<void> {
    const dialogResponse = await this.dialogService.open<ImageExplorerComponent, Id>({
      componentType: ImageExplorerComponent,
      isModal: true,
    });

    if (dialogResponse !== 'close') {
      const imageId = dialogResponse.split('-')[0];
      this.form.patchValue({ bannerImageId: imageId });
      this.requestFetchMainImage.emit(imageId);
    }
  }

  public onRevertImage(): void {
    this.form.patchValue({ bannerImageId: this.originalArticle?.bannerImageId ?? '' });
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dialog: Dialog = {
      title: 'Confirm',
      body: this.originalArticle?.title
        ? `Update ${this.originalArticle.title} article?`
        : `Publish ${this.formData.title} to News page?`,
      confirmButtonText: this.originalArticle ? 'Update' : 'Publish',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: { dialog },
      },
    );

    if (result !== 'confirm') {
      return;
    }

    if (this.originalArticle) {
      this.requestUpdateArticle.emit(this.originalArticle.id);
    } else {
      this.requestPublishArticle.emit();
    }
  }

  private initForm(): void {
    this.form = this.formBuilder.group<ArticleFormGroup>({
      bannerImageId: new FormControl(this.formData.bannerImageId, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      title: new FormControl(this.formData.title, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
      body: new FormControl(this.formData.body, {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/[^\s]/)],
      }),
    });
  }

  private initFormValueChangeListener(): void {
    this.form.valueChanges
      .pipe(debounceTime(250), untilDestroyed(this))
      .subscribe((formData: Partial<ArticleFormData>) => {
        this.change.emit({
          articleId: this.originalArticle?.id ?? null,
          formData,
        });
      });

    // Manually trigger form data change to pass initial form data to store
    this.form.updateValueAndValidity();
  }
}
