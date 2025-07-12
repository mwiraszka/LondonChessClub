import { MockStore, provideMockStore } from '@ngrx/store/testing';
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
import { ArticlesActions } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { query } from '@app/utils';

import { ArticleFormComponent } from './article-form.component';

describe('ArticleFormComponent', () => {
  let fixture: ComponentFixture<ArticleFormComponent>;
  let component: ArticleFormComponent;
  let store: MockStore;
  let dialogService: DialogService;

  let cancelSpy: jest.SpyInstance;
  let dialogOpenSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  let imageExplorerSpy: jest.SpyInstance;
  let initFormSpy: jest.SpyInstance;
  let initFormValueChangeListenerSpy: jest.SpyInstance;
  let restoreSpy: jest.SpyInstance;
  let revertImageSpy: jest.SpyInstance;
  let submitSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    })
      .overrideComponent(ArticleFormComponent, {
        remove: { imports: [MarkdownRendererComponent] },
        add: { imports: [MockComponent(MarkdownRendererComponent)] },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ArticleFormComponent);
        component = fixture.componentInstance;

        dialogService = TestBed.inject(DialogService);
        store = TestBed.inject(MockStore);

        cancelSpy = jest.spyOn(component, 'onCancel');
        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        dispatchSpy = jest.spyOn(store, 'dispatch');
        imageExplorerSpy = jest.spyOn(component, 'onOpenImageExplorer');
        // @ts-expect-error Private class member
        initFormSpy = jest.spyOn(component, 'initForm');
        initFormValueChangeListenerSpy = jest.spyOn(
          component,
          // @ts-expect-error Private class member
          'initFormValueChangeListener',
        );
        restoreSpy = jest.spyOn(component, 'onRestore');
        revertImageSpy = jest.spyOn(component, 'onRevertImage');
        submitSpy = jest.spyOn(component, 'onSubmit');

        component.bannerImage = null;
        component.formData = pick(MOCK_ARTICLES[0], ARTICLE_FORM_DATA_PROPERTIES);
        component.hasUnsavedChanges = false;
        component.originalArticle = null;

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI elements', () => {
    describe('modification info', () => {
      it('should render if originalArticle is defined', () => {
        component.originalArticle = MOCK_ARTICLES[0];
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).not.toBeNull();
      });

      it('should not render if originalArticle is null', () => {
        component.originalArticle = null;
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).toBeNull();
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
        component.originalArticle = { ...MOCK_ARTICLES[1], bannerImageId: 'same-id' };
        fixture.detectChanges();

        const revertImageButton = query(fixture.debugElement, '.revert-image-button');
        expect(revertImageButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if current banner image differs from originalArticle banner image', () => {
        component.form.controls.bannerImageId.setValue('mock-id');
        component.originalArticle = {
          ...MOCK_ARTICLES[1],
          bannerImageId: 'different-id',
        };
        fixture.detectChanges();

        const revertImageButton = query(fixture.debugElement, '.revert-image-button');
        revertImageButton.triggerEventHandler('click');

        expect(revertImageButton.nativeElement.disabled).toBe(false);
        expect(revertImageSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('restore button', () => {
      it('should be disabled if there are no unsaved changes', () => {
        component.hasUnsavedChanges = false;
        fixture.detectChanges();

        const restoreButton = query(fixture.debugElement, '.restore-button');
        expect(restoreButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if there are unsaved changes', () => {
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        const restoreButton = query(fixture.debugElement, '.restore-button');
        restoreButton.triggerEventHandler('click');

        expect(restoreButton.nativeElement.disabled).toBe(false);
        expect(restoreSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('cancel button', () => {
      it('should be enabled if there are unsaved changes', () => {
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        const cancelButton = query(fixture.debugElement, '.cancel-button');
        cancelButton.triggerEventHandler('click');

        expect(cancelButton.nativeElement.disabled).toBe(false);
        expect(cancelSpy).toHaveBeenCalledTimes(1);
      });

      it('should also be enabled if there are no unsaved changes', () => {
        component.hasUnsavedChanges = false;
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
        component.hasUnsavedChanges = false;
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be disabled if the form is invalid', () => {
        component.form.setValue({
          ...pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES),
          body: '', // Invalid - body is a required field
        });
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if there are unsaved changes and the form is valid', () => {
        component.form.setValue(pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES));
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        query(fixture.debugElement, 'form').triggerEventHandler('ngSubmit');

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(false);
        expect(submitSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('form initialization', () => {
    describe('handling form data', () => {
      describe('if form has unsaved changes', () => {
        beforeEach(() => {
          component.hasUnsavedChanges = true;
          fixture.detectChanges();

          jest.clearAllMocks();
          component.ngOnInit();
        });

        it('should initialize the form value change listener', () => {
          expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
        });

        it('should initialize the form with touched values from formData', () => {
          expect(initFormSpy).toHaveBeenCalledTimes(1);
          expect(initFormSpy).toHaveBeenCalledWith(component.formData);

          for (const property of ARTICLE_FORM_DATA_PROPERTIES) {
            expect(component.form.controls[property].value).toBe(
              component.formData[property],
            );
            expect(component.form.controls[property].touched).toBe(true);
          }
        });
      });

      describe('if form does not have unsaved changes', () => {
        beforeEach(() => {
          component.hasUnsavedChanges = false;
          fixture.detectChanges();

          jest.clearAllMocks();
          component.ngOnInit();
        });

        it('should initialize the form value change listener', () => {
          expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
        });

        it('should initialize the form with untouched values from formData', () => {
          expect(initFormSpy).toHaveBeenCalledTimes(1);
          expect(initFormSpy).toHaveBeenCalledWith(component.formData);

          for (const property of ARTICLE_FORM_DATA_PROPERTIES) {
            expect(component.form.controls[property].value).toBe(
              component.formData[property],
            );
            expect(component.form.controls[property].untouched).toBe(true);
          }
        });
      });
    });

    describe('fetching banner image', () => {
      it('should not dispatch fetchOriginalRequested if bannerImage is defined', () => {
        component.bannerImage = MOCK_IMAGES[0];
        fixture.detectChanges();

        jest.clearAllMocks();
        component.ngOnInit();

        expect(dispatchSpy).not.toHaveBeenCalledWith(
          ImagesActions.fetchOriginalRequested({
            imageId: component.formData.bannerImageId,
          }),
        );
      });

      it('should dispatch fetchOriginalRequested if bannerImage is null', () => {
        component.bannerImage = null;
        fixture.detectChanges();

        jest.clearAllMocks();
        component.ngOnInit();

        expect(dispatchSpy).toHaveBeenCalledWith(
          ImagesActions.fetchOriginalRequested({
            imageId: component.formData.bannerImageId,
          }),
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
      component.hasUnsavedChanges = true;
      component.originalArticle = MOCK_ARTICLES[4];
      fixture.detectChanges();

      component.ngOnInit();

      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => jest.useRealTimers());

    it('should dispatch article form data reset and re-initialize form if dialog is confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

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

      expect(dispatchSpy).toHaveBeenCalledWith(
        ArticlesActions.articleFormDataReset({ articleId: MOCK_ARTICLES[4].id }),
      );
      expect(initFormSpy).toHaveBeenCalledTimes(1);
      expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

      // Verify formValueChanged was dispatched at least once
      const formValueChangedCalls = dispatchSpy.mock.calls.filter(
        call => call[0].type === ArticlesActions.formValueChanged.type,
      );
      expect(formValueChangedCalls.length).toBeGreaterThan(0);
    });

    it('should not dispatch reset action or re-initialize form if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      await component.onRestore();
      jest.runAllTimers();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(initFormSpy).not.toHaveBeenCalled();
      expect(initFormValueChangeListenerSpy).not.toHaveBeenCalled();
    });
  });

  describe('onOpenImageExplorer', () => {
    it('should set selected image as the new banner image', async () => {
      const newImageId = 'new_image_id';
      dialogOpenSpy.mockResolvedValue(`${newImageId}-thumb`);
      component.form.patchValue({ bannerImageId: 'old-image-id' });
      fixture.detectChanges();
      jest.clearAllMocks();

      await component.onOpenImageExplorer();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: ImageExplorerComponent,
        isModal: true,
      });
      expect(component.form.controls.bannerImageId.value).toBe(newImageId);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ImagesActions.fetchOriginalRequested({ imageId: newImageId }),
      );
    });

    it('should keep current banner image if dialog is closed', async () => {
      dialogOpenSpy.mockResolvedValue('close');
      component.form.patchValue({ bannerImageId: 'old-image-id' });
      fixture.detectChanges();
      jest.clearAllMocks();

      await component.onOpenImageExplorer();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: ImageExplorerComponent,
        isModal: true,
      });
      expect(component.form.controls.bannerImageId.value).toBe('old-image-id');
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('onRevertImage', () => {
    it('should patch value originalArticle bannerImageId if originalArticle is defined', () => {
      component.formData = pick(MOCK_ARTICLES[2], ARTICLE_FORM_DATA_PROPERTIES);
      component.originalArticle = MOCK_ARTICLES[3];
      fixture.detectChanges();

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
      component.formData = pick(MOCK_ARTICLES[2], ARTICLE_FORM_DATA_PROPERTIES);
      component.originalArticle = null;
      fixture.detectChanges();

      component.ngOnInit();
      expect(component.form.controls.bannerImageId.value).toBe(
        MOCK_ARTICLES[2].bannerImageId,
      );

      component.onRevertImage();

      expect(component.form.controls.bannerImageId.value).toBe('');
    });
  });

  describe('onCancel', () => {
    it('should dispatch cancelSelected action', () => {
      component.onCancel();
      expect(dispatchSpy).toHaveBeenCalledWith(ArticlesActions.cancelSelected());
    });
  });

  describe('onSubmit', () => {
    it('should mark all fields as touched if form is invalid on submit', async () => {
      component.form.patchValue({ title: '' }); // Invalid - caption field is required
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();

      expect(component.form.controls.title.touched).toBe(true);
      expect(component.form.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data if adding a new article', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      component.formData = pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES);
      component.originalArticle = null;
      fixture.detectChanges();

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
      expect(dispatchSpy).toHaveBeenCalledWith(ArticlesActions.publishArticleRequested());
    });

    it('should open confirmation dialog with correct data if updating an article', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      component.formData = pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES);
      component.originalArticle = MOCK_ARTICLES[2];
      fixture.detectChanges();

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
      expect(dispatchSpy).toHaveBeenCalledWith(
        ArticlesActions.updateArticleRequested({ articleId: MOCK_ARTICLES[2].id }),
      );
    });

    it('should not dispatch action if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      component.formData = pick(MOCK_ARTICLES[3], ARTICLE_FORM_DATA_PROPERTIES);
      component.originalArticle = null;
      fixture.detectChanges();

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        ArticlesActions.publishArticleRequested(),
      );
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        ArticlesActions.updateArticleRequested({ articleId: MOCK_ARTICLES[2].id }),
      );
    });
  });
});
