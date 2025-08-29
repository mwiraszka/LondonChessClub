import { pick } from 'lodash';
import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { ARTICLE_FORM_DATA_PROPERTIES } from '@app/constants';
import { MOCK_ARTICLES } from '@app/mocks/articles.mock';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { DialogService } from '@app/services';
import { query } from '@app/utils';

import { ArticleFormComponent } from './article-form.component';

describe('ArticleFormComponent', () => {
  let fixture: ComponentFixture<ArticleFormComponent>;
  let component: ArticleFormComponent;

  let dialogService: DialogService;

  let cancelSpy: jest.SpyInstance;
  let changeSpy: jest.SpyInstance;
  let dialogOpenSpy: jest.SpyInstance;
  let imageExplorerSpy: jest.SpyInstance;
  let initFormSpy: jest.SpyInstance;
  let initFormValueChangeListenerSpy: jest.SpyInstance;
  let requestFetchMainImageSpy: jest.SpyInstance;
  let requestPublishArticleSpy: jest.SpyInstance;
  let requestUpdateArticleSpy: jest.SpyInstance;
  let restoreSpy: jest.SpyInstance;
  let revertImageSpy: jest.SpyInstance;
  let submitSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleFormComponent, ReactiveFormsModule],
      providers: [FormBuilder, { provide: DialogService, useValue: { open: jest.fn() } }],
    })
      .overrideComponent(ArticleFormComponent, {
        remove: { imports: [MarkdownRendererComponent] },
        add: { imports: [MockComponent(MarkdownRendererComponent)] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleFormComponent);
    component = fixture.componentInstance;

    dialogService = TestBed.inject(DialogService);

    cancelSpy = jest.spyOn(component.cancel, 'emit');
    changeSpy = jest.spyOn(component.change, 'emit');
    restoreSpy = jest.spyOn(component.restore, 'emit');
    dialogOpenSpy = jest.spyOn(dialogService, 'open');
    imageExplorerSpy = jest.spyOn(component, 'onOpenImageExplorer');
    // @ts-expect-error Private class member
    initFormSpy = jest.spyOn(component, 'initForm');
    initFormValueChangeListenerSpy = jest.spyOn(
      component,
      // @ts-expect-error Private class member
      'initFormValueChangeListener',
    );
    requestFetchMainImageSpy = jest.spyOn(component.requestFetchMainImage, 'emit');
    requestPublishArticleSpy = jest.spyOn(component.requestPublishArticle, 'emit');
    requestUpdateArticleSpy = jest.spyOn(component.requestUpdateArticle, 'emit');
    revertImageSpy = jest.spyOn(component, 'onRevertImage');
    submitSpy = jest.spyOn(component, 'onSubmit');

    component.bannerImage = null;
    component.formData = pick(MOCK_ARTICLES[0], ARTICLE_FORM_DATA_PROPERTIES);
    component.hasUnsavedChanges = false;
    component.originalArticle = null;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    describe('handling form data', () => {
      it('should initialize with provided formData', () => {
        for (const p of ARTICLE_FORM_DATA_PROPERTIES) {
          expect(component.form.controls[p].value).toBe(component.formData[p]);
        }
      });
    });

    describe('fetching banner image', () => {
      it('should not emit request fetch main image event if bannerImage is defined', () => {
        fixture.componentRef.setInput('bannerImage', MOCK_IMAGES[0]);
        requestFetchMainImageSpy.mockClear();
        component.ngOnInit();

        expect(requestFetchMainImageSpy).not.toHaveBeenCalled();
      });

      it('should emit request fetch main image event if bannerImage is null', () => {
        fixture.componentRef.setInput('bannerImage', null);
        requestFetchMainImageSpy.mockClear();
        component.ngOnInit();

        expect(requestFetchMainImageSpy).toHaveBeenCalledWith(
          component.formData.bannerImageId,
        );
      });
    });
  });

  describe('form validation', () => {
    describe('required validator', () => {
      it('should mark empty field as invalid', () => {
        component.form.patchValue({ title: '' });
        fixture.detectChanges();

        expect(component.form.controls.title.hasError('required')).toBe(true);
      });

      it('should mark non-empty field as valid', () => {
        component.form.patchValue({ bannerImageId: 'id-1234' });
        fixture.detectChanges();

        expect(component.form.controls.bannerImageId.hasError('required')).toBe(false);
      });
    });

    describe('pattern validator', () => {
      it('should mark field with an invalid pattern as invalid', () => {
        component.form.patchValue({
          bannerImageId: ' ',
          title: '\t\n',
          body: '  ',
        });
        fixture.detectChanges();

        expect(component.form.controls.bannerImageId.hasError('pattern')).toBe(true);
        expect(component.form.controls.title.hasError('pattern')).toBe(true);
        expect(component.form.controls.body.hasError('pattern')).toBe(true);
      });

      it('should mark field with a valid pattern as valid', () => {
        component.form.patchValue({
          bannerImageId: '🔥',
          title: 'abc',
          body: '123',
        });
        fixture.detectChanges();

        expect(component.form.controls.bannerImageId.hasError('pattern')).toBe(false);
        expect(component.form.controls.title.hasError('pattern')).toBe(false);
        expect(component.form.controls.body.hasError('pattern')).toBe(false);
      });
    });
  });

  describe('onRestore', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('hasUnsavedChanges', true);
      fixture.componentRef.setInput('originalArticle', MOCK_ARTICLES[4]);
      component.ngOnInit();

      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => jest.useRealTimers());

    it('should emit both change and restore events and re-initialize form if dialog is confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_ARTICLES[4], ARTICLE_FORM_DATA_PROPERTIES),
      );

      await component.onRestore();

      jest.runAllTimers();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: 'Restore original article data? All changes will be lost.',
            confirmButtonText: 'Restore',
            confirmButtonType: 'warning',
          },
        },
      });

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(restoreSpy).toHaveBeenCalledWith(MOCK_ARTICLES[4].id);
      expect(initFormSpy).toHaveBeenCalledTimes(1);
      expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

      for (const key of ARTICLE_FORM_DATA_PROPERTIES) {
        expect(component.form.controls[key].value).toBe(
          // @ts-expect-error index signature
          component.originalArticle[key],
        );
      }
    });

    it('should not emit change or restore event or re-initialize form if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      await component.onRestore();

      jest.runAllTimers();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).not.toHaveBeenCalled();
      expect(restoreSpy).not.toHaveBeenCalled();
      expect(initFormSpy).not.toHaveBeenCalled();
      expect(initFormValueChangeListenerSpy).not.toHaveBeenCalled();
    });
  });

  describe('onOpenImageExplorer', () => {
    it('should set selected image as the new banner image', async () => {
      const newImageId = 'new_image_id';
      dialogOpenSpy.mockResolvedValue(`${newImageId}-thumb`);
      component.form.patchValue({ bannerImageId: 'old-image-id' });
      jest.clearAllMocks();

      await component.onOpenImageExplorer();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: ImageExplorerComponent,
        isModal: true,
      });
      expect(component.form.controls.bannerImageId.value).toBe(newImageId);
      expect(requestFetchMainImageSpy).toHaveBeenCalledWith(newImageId);
    });

    it('should keep current banner image if dialog is closed', async () => {
      dialogOpenSpy.mockResolvedValue('close');
      component.form.patchValue({ bannerImageId: 'old-image-id' });
      jest.clearAllMocks();

      await component.onOpenImageExplorer();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: ImageExplorerComponent,
        isModal: true,
      });
      expect(component.form.controls.bannerImageId.value).toBe('old-image-id');
      expect(requestFetchMainImageSpy).not.toHaveBeenCalled();
    });
  });

  describe('onRevertImage', () => {
    it('should patch value originalArticle bannerImageId if originalArticle is defined', () => {
      fixture.componentRef.setInput('originalArticle', MOCK_ARTICLES[3]);
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_ARTICLES[2], ARTICLE_FORM_DATA_PROPERTIES),
      );

      component.ngOnInit();
      expect(component.form.controls.bannerImageId.value).toBe(
        MOCK_ARTICLES[2].bannerImageId,
      );

      component.onRevertImage();

      expect(component.form.controls.bannerImageId.value).toBe(
        MOCK_ARTICLES[3].bannerImageId,
      );
    });

    it('should patch value to empty string otherwise', async () => {
      fixture.componentRef.setInput('originalArticle', null);
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_ARTICLES[2], ARTICLE_FORM_DATA_PROPERTIES),
      );

      component.ngOnInit();
      expect(component.form.controls.bannerImageId.value).toBe(
        MOCK_ARTICLES[2].bannerImageId,
      );

      component.onRevertImage();

      expect(component.form.controls.bannerImageId.value).toBe('');
    });
  });

  describe('onCancel', () => {
    it('should emit cancel event', () => {
      component.onCancel();
      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should mark all fields as touched if form is invalid on submit', async () => {
      component.form.patchValue({ title: '' });
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();

      expect(component.form.controls.title.touched).toBe(true);
      expect(component.form.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data and emit request publish article event if adding a new article', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      fixture.componentRef.setInput('originalArticle', null);
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES),
      );

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Publish ${MOCK_ARTICLES[3].title} to News page?`,
            confirmButtonText: 'Publish',
          },
        },
      });
      expect(requestPublishArticleSpy).toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data and emit request update article event if updating an article', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      fixture.componentRef.setInput('originalArticle', MOCK_ARTICLES[2]);
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES),
      );

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Update ${MOCK_ARTICLES[2].title} article?`,
            confirmButtonText: 'Update',
          },
        },
      });
      expect(requestUpdateArticleSpy).toHaveBeenCalledWith(MOCK_ARTICLES[2].id);
    });

    it('should not emit publish or update event if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      fixture.componentRef.setInput(
        'formData',
        pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES),
      );
      fixture.componentRef.setInput('originalArticle', null);

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(requestPublishArticleSpy).not.toHaveBeenCalled();
      expect(requestUpdateArticleSpy).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    describe('modification info', () => {
      it('should render if originalArticle is defined', () => {
        fixture.componentRef.setInput('originalArticle', MOCK_ARTICLES[0]);
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).toBeTruthy();
      });

      it('should not render if originalArticle is null', () => {
        fixture.componentRef.setInput('originalArticle', null);
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).toBeFalsy();
      });
    });

    describe('image explorer button', () => {
      it('should call onImageExplorer when clicked', async () => {
        dialogOpenSpy.mockResolvedValue('close');
        const imageExplorerButton = query(fixture.debugElement, '.image-explorer-button');
        imageExplorerButton.triggerEventHandler('click');

        expect(imageExplorerButton.nativeElement.disabled).toBe(false);
        expect(imageExplorerSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('revert image button', () => {
      it('should be disabled if original banner image is already set', () => {
        component.form.controls.bannerImageId.setValue('same-id');
        fixture.componentRef.setInput('originalArticle', {
          ...MOCK_ARTICLES[1],
          bannerImageId: 'same-id',
        });
        fixture.detectChanges();

        expect(
          query(fixture.debugElement, '.revert-image-button').nativeElement.disabled,
        ).toBe(true);
      });

      it('should be enabled if current banner image differs from originalArticle banner image', () => {
        component.form.controls.bannerImageId.setValue('mock-id');
        fixture.componentRef.setInput('originalArticle', {
          ...MOCK_ARTICLES[1],
          bannerImageId: 'different-id',
        });
        fixture.detectChanges();

        const revertImageButton = query(fixture.debugElement, '.revert-image-button');
        revertImageButton.triggerEventHandler('click');

        expect(revertImageButton.nativeElement.disabled).toBe(false);
        expect(revertImageSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('restore button', () => {
      it('should be disabled if there are no unsaved changes', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', false);
        fixture.detectChanges();

        expect(
          query(fixture.debugElement, '.restore-button').nativeElement.disabled,
        ).toBe(true);
      });

      it('should be enabled if there are unsaved changes', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', true);
        fixture.detectChanges();

        expect(
          query(fixture.debugElement, '.restore-button').nativeElement.disabled,
        ).toBe(false);
      });
    });

    describe('cancel button', () => {
      it('should be enabled if there are unsaved changes', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', true);
        fixture.detectChanges();

        const cancelButton = query(fixture.debugElement, '.cancel-button');
        cancelButton.triggerEventHandler('click');

        expect(cancelButton.nativeElement.disabled).toBe(false);
        expect(cancelSpy).toHaveBeenCalledTimes(1);
      });

      it('should also be enabled if there are no unsaved changes', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', false);
        fixture.detectChanges();

        const cancelButton = query(fixture.debugElement, '.cancel-button');
        cancelButton.triggerEventHandler('click');

        expect(cancelButton.nativeElement.disabled).toBe(false);
        expect(cancelSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('submit button', () => {
      it('should be disabled if there are no unsaved changes', () => {
        component.form.setValue(pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES));
        fixture.componentRef.setInput('hasUnsavedChanges', false);
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be disabled if the form is invalid', () => {
        component.form.setValue({
          ...pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES),
          body: '', // Invalid - body is a required field
        });
        fixture.componentRef.setInput('hasUnsavedChanges', true);
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if there are unsaved changes and the form is valid', () => {
        fixture.componentRef.setInput('hasUnsavedChanges', true);
        component.form.setValue(pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES));
        query(fixture.debugElement, 'form').triggerEventHandler('ngSubmit');
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');

        expect(submitButton.nativeElement.disabled).toBe(false);
        expect(submitSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
