import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import IconsModule from '@app/icons';
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

  const mockArticle = MOCK_ARTICLES[0];
  const mockImage = MOCK_IMAGES[0];
  const mockFormData = {
    bannerImageId: mockArticle.bannerImageId,
    title: mockArticle.title,
    body: mockArticle.body,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleFormComponent, IconsModule, ReactiveFormsModule],
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
        store = TestBed.inject(MockStore);
        dialogService = TestBed.inject(DialogService);

        component.bannerImage = mockImage;
        component.formData = mockFormData;
        component.hasUnsavedChanges = false;
        component.originalArticle = mockArticle;

        jest.spyOn(store, 'dispatch');

        fixture.detectChanges();
      });
  });

  describe('form initialization', () => {
    it('should initialize form and its value change listener', () => {
      // @ts-expect-error Private class member
      const initFormSpy = jest.spyOn(component, 'initForm');
      const initFormValueChangeListenerSpy = jest.spyOn(
        component,
        // @ts-expect-error Private class member
        'initFormValueChangeListener',
      );

      component.ngOnInit();

      expect(initFormSpy).toHaveBeenCalledTimes(1);
      expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
    });

    it('should initialize the form with correct values and all should be untouched', () => {
      expect(component.form).toBeTruthy();
      expect(component.form.get('bannerImageId')?.value).toBe(mockFormData.bannerImageId);
      expect(component.form.get('title')?.value).toBe(mockFormData.title);
      expect(component.form.get('body')?.value).toBe(mockFormData.body);

      expect(component.form.get('bannerImageId')?.touched).toBe(false);
      expect(component.form.get('title')?.touched).toBe(false);
      expect(component.form.get('body')?.touched).toBe(false);
    });

    it('should mark all fields as touched when hasUnsavedChanges is true', () => {
      component.hasUnsavedChanges = true;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.form.get('bannerImageId')?.touched).toBe(true);
      expect(component.form.get('title')?.touched).toBe(true);
      expect(component.form.get('body')?.touched).toBe(true);
    });

    it('should fetch banner image if not provided but ID exists', () => {
      component.bannerImage = null;
      fixture.detectChanges();

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({
          imageId: mockFormData.bannerImageId,
        }),
      );
    });
  });

  describe('form validation', () => {
    describe('required validator', () => {
      it('should mark empty field as invalid', () => {
        component.form.patchValue({
          title: '',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('title')?.hasError('required')).toBe(true);
      });

      it('should mark non-empty field as valid', () => {
        component.form.patchValue({
          bannerImageId: 'a',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('bannerImageId')?.hasError('required')).toBe(false);
      });
    });

    describe('pattern validator', () => {
      it('should mark field with an invalid pattern as invalid', () => {
        component.form.patchValue({
          bannerImageId: ' ',
          title: '\t\n',
          body: '  ',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('bannerImageId')?.hasError('pattern')).toBe(true);
        expect(component.form.get('title')?.hasError('pattern')).toBe(true);
        expect(component.form.get('body')?.hasError('pattern')).toBe(true);
      });

      it('should mark field with a valid pattern as valid', () => {
        component.form.patchValue({
          bannerImageId: '🔥',
          title: 'abc',
          body: '123',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('bannerImageId')?.hasError('pattern')).toBe(false);
        expect(component.form.get('title')?.hasError('pattern')).toBe(false);
        expect(component.form.get('body')?.hasError('pattern')).toBe(false);
      });
    });
  });

  describe('image explorer button', () => {
    it('should set selected image as the new banner image', async () => {
      component.form.patchValue({ bannerImageId: 'old-image-id' });
      const thumbnailImageId = 'new_image_id-thumb';
      const expectedNewImageId = 'new_image_id';
      const imageExplorerButton = query(fixture.debugElement, '.image-explorer-button');
      const dialogOpenSpy = jest
        .spyOn(dialogService, 'open')
        .mockResolvedValue(thumbnailImageId);
      fixture.detectChanges();

      imageExplorerButton.triggerEventHandler('click', null);
      await fixture.whenStable();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: ImageExplorerComponent,
        isModal: true,
      });
      expect(component.form.get('bannerImageId')?.value).toBe(expectedNewImageId);
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: expectedNewImageId }),
      );
    });

    it('should keep current banner image if no image is selected', () => {
      const imageExplorerButton = query(fixture.debugElement, '.image-explorer-button');
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockResolvedValue('cancel');
      fixture.detectChanges();

      imageExplorerButton.triggerEventHandler('click');
      fixture.detectChanges();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: ImageExplorerComponent,
        isModal: true,
      });
      expect(component.form.get('bannerImageId')?.value).toBe(mockArticle.bannerImageId);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('revert button', () => {
    it('should be disabled if original banner image is already set', () => {
      const revertButton = query(fixture.debugElement, '.revert-button');
      fixture.detectChanges();

      revertButton.triggerEventHandler('click');
      fixture.detectChanges();

      expect(revertButton).not.toBeNull();
      expect(revertButton.nativeElement.disabled).toBe(true);
      expect(component.form.get('bannerImageId')?.value).toBe(mockArticle.bannerImageId);
    });

    it('should be enabled if current banner image is different, and revert to original image when pressed', async () => {
      const revertButton = query(fixture.debugElement, '.revert-button');
      component.form.controls.bannerImageId.setValue('new-image-id');
      fixture.detectChanges();

      revertButton.triggerEventHandler('click');
      await fixture.whenStable();

      expect(revertButton).not.toBeNull();
      expect(revertButton.nativeElement.disabled).toBe(false);
      expect(component.form.get('bannerImageId')?.value).toBe(mockArticle.bannerImageId);
    });
  });

  describe('cancel button', () => {
    it('should dispatch cancelSelected action when pressed', () => {
      query(fixture.debugElement, '.cancel-button').triggerEventHandler('click');
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(ArticlesActions.cancelSelected());
    });
  });

  describe('submit button', () => {
    it('should be disabled when there are no unsaved changes', () => {
      component.hasUnsavedChanges = false;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
        true,
      );
    });

    it('should be disabled when the form is invalid', () => {
      component.hasUnsavedChanges = true;
      component.form.patchValue({
        title: '', // Invalid title
      });
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
        true,
      );
    });

    it('should be enabled when there are unsaved changes and the form is valid', () => {
      component.hasUnsavedChanges = true;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
        false,
      );
    });
  });

  describe('form submission', () => {
    it('should mark all fields as touched if form is invalid on submit', async () => {
      const dialogOpenSpy = jest.spyOn(dialogService, 'open');
      component.form.patchValue({
        bannerImageId: '',
        title: '',
        body: '',
      });
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();
      fixture.detectChanges();

      expect(component.form.get('bannerImageId')?.touched).toBe(true);
      expect(component.form.get('title')?.touched).toBe(true);
      expect(component.form.get('body')?.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data when publishing new article', async () => {
      const dialogOpenSpy = jest
        .spyOn(dialogService, 'open')
        .mockResolvedValue('confirm');

      component.originalArticle = null; // Simulate a new article
      component.hasUnsavedChanges = true; // Make sure submit button is enabled
      fixture.detectChanges();

      const form = fixture.debugElement.query(selector => selector.name === 'form');
      form.triggerEventHandler('ngSubmit');

      await fixture.whenStable();
      fixture.detectChanges();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Publish article',
            body: `Publish ${mockFormData.title}`,
            confirmButtonText: 'Add',
          },
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        ArticlesActions.publishArticleRequested(),
      );
    });

    it('should open confirmation dialog with correct data when updating article', async () => {
      const dialogOpenSpy = jest
        .spyOn(dialogService, 'open')
        .mockResolvedValue('confirm');

      component.hasUnsavedChanges = true; // Make sure submit button is enabled
      fixture.detectChanges();

      const form = fixture.debugElement.query(selector => selector.name === 'form');
      form.triggerEventHandler('ngSubmit');

      await fixture.whenStable();
      fixture.detectChanges();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Update article',
            body: `Update ${mockArticle.title}`,
            confirmButtonText: 'Update',
          },
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        ArticlesActions.updateArticleRequested({ articleId: mockArticle.id }),
      );
    });

    it('should not dispatch action if dialog is cancelled', async () => {
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockResolvedValue('cancel');
      component.hasUnsavedChanges = true; // Make sure submit button is enabled
      fixture.detectChanges();

      const form = fixture.debugElement.query(selector => selector.name === 'form');
      form.triggerEventHandler('ngSubmit');

      await fixture.whenStable();
      fixture.detectChanges();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        ArticlesActions.publishArticleRequested(),
      );
      expect(store.dispatch).not.toHaveBeenCalledWith(
        ArticlesActions.updateArticleRequested({ articleId: mockArticle.id }),
      );
    });
  });
});
