import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { DialogService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { query } from '@app/utils';

import { ImageFormComponent } from './image-form.component';

describe('ImageFormComponent', () => {
  let fixture: ComponentFixture<ImageFormComponent>;
  let component: ImageFormComponent;
  let store: MockStore;
  let dialogService: DialogService;

  const mockImage = MOCK_IMAGES[0];
  const mockExistingAlbums = ['Album 1', 'Album 2', 'Album 3'];
  const mockFormData = {
    filename: mockImage.filename,
    dataUrl: 'data:image/jpeg;base64,example',
    caption: mockImage.caption,
    albums: mockImage.albums,
    newAlbum: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ImageFormComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        dialogService = TestBed.inject(DialogService);

        component.existingAlbums = mockExistingAlbums;
        component.formData = mockFormData;
        component.hasUnsavedChanges = false;
        component.originalImage = mockImage;

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
      expect(component.form.get('filename')?.value).toBe(mockFormData.filename);
      expect(component.form.get('dataUrl')?.value).toBe(mockFormData.dataUrl);
      expect(component.form.get('caption')?.value).toBe(mockFormData.caption);
      expect(component.form.get('albums')?.value).toEqual(mockFormData.albums);
      expect(component.form.get('newAlbum')?.value).toBe(mockFormData.newAlbum);

      expect(component.form.get('filename')?.touched).toBe(false);
      expect(component.form.get('caption')?.touched).toBe(false);
      expect(component.form.get('albums')?.touched).toBe(false);
      expect(component.form.get('newAlbum')?.touched).toBe(false);
    });

    it('should mark all (touchable) fields as touched when hasUnsavedChanges is true', () => {
      component.hasUnsavedChanges = true;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.form.get('filename')?.touched).toBe(true);
      expect(component.form.get('caption')?.touched).toBe(true);
      expect(component.form.get('albums')?.touched).toBe(true);
      expect(component.form.get('newAlbum')?.touched).toBe(true);
    });
  });

  describe('form validation', () => {
    describe('required validator', () => {
      it('should mark empty field as invalid', () => {
        component.form.patchValue({
          caption: '',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('caption')?.hasError('required')).toBe(true);
      });

      it('should mark non-empty field as valid', () => {
        component.form.patchValue({
          caption: 'Valid Caption',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('caption')?.hasError('required')).toBe(false);
      });
    });

    describe('one album minimum validator', () => {
      it('should mark form group as valid if no album is selected or added', () => {
        component.form.patchValue({
          albums: [],
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.hasError('albumRequired')).toBe(true);
      });

      it('should not mark form group as invalid when at least one album is selected', () => {
        component.form.patchValue({
          albums: ['Album 1'],
          newAlbum: '',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.hasError('albumRequired')).toBe(false);
      });

      it('should not mark form group as invalid when a new album is added', () => {
        component.form.patchValue({
          albums: [],
          newAlbum: 'New Album',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.hasError('albumRequired')).toBe(false);
      });
    });

    describe('pattern validator', () => {
      it('should mark field with an invalid pattern as invalid', () => {
        component.form.patchValue({
          newAlbum: '   ',
        });
        component.form.get('newAlbum')?.markAsTouched();
        fixture.detectChanges();

        expect(component.form.get('newAlbum')?.hasError('pattern')).toBe(true);
      });

      it('should mark field with a valid pattern as valid', () => {
        component.form.patchValue({
          newAlbum: '🔥',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('newAlbum')?.hasError('pattern')).toBe(false);
      });
    });

    describe('image caption validator', () => {
      it('should mark field with an out-of-range ASCII character as invalid', () => {
        component.form.patchValue({
          caption: 'Żubrówka',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('caption')?.hasError('invalidImageCaption')).toBe(true);
      });

      it('should mark field without an out-of-range ASCII character as valid', () => {
        component.form.patchValue({
          caption: 'Absolut',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('caption')?.hasError('invalidImageCaption')).toBe(
          false,
        );
      });
    });

    describe('unique album validator', () => {
      it('should mark duplicate album as invalid', () => {
        component.form.patchValue({
          albums: ['Album 1', 'Album 2'],
          newAlbum: 'Album 1',
        });
        component.form.get('newAlbum')?.markAsTouched();
        fixture.detectChanges();

        expect(component.form.get('newAlbum')?.hasError('albumAlreadyExists')).toBe(true);
      });

      it('should validate newAlbum as valid if unique', () => {
        component.form.patchValue({
          newAlbum: 'Unique Album',
        });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.get('newAlbum')?.hasError('albumAlreadyExists')).toBe(
          false,
        );
      });
    });
  });

  describe('toggleAlbum', () => {
    it('should add album to albums array if not already included', () => {
      const initialAlbums = ['Album 1'];
      component.form.patchValue({ albums: initialAlbums });
      fixture.detectChanges();

      component.toggleAlbum('Album 2');

      expect(component.form.get('albums')?.value).toEqual(['Album 1', 'Album 2']);
      expect(component.form.get('albums')?.dirty).toBe(true);
    });

    it('should remove album from albums array if already included', () => {
      const initialAlbums = ['Album 1', 'Album 2'];
      component.form.patchValue({ albums: initialAlbums });
      fixture.detectChanges();

      component.toggleAlbum('Album 1');

      expect(component.form.get('albums')?.value).toEqual(['Album 2']);
      expect(component.form.get('albums')?.dirty).toBe(true);
    });

    it('should sort albums alphabetically when adding a new one', () => {
      const initialAlbums = ['C Album', 'A Album'];
      component.form.patchValue({ albums: initialAlbums });
      fixture.detectChanges();

      component.toggleAlbum('B Album');

      expect(component.form.get('albums')?.value).toEqual([
        'A Album',
        'B Album',
        'C Album',
      ]);
    });
  });

  describe('onUploadNewImage', () => {
    it('should update form with new image data when valid image is uploaded', () => {
      component.form.patchValue({
        dataUrl: 'data:image/jpeg;base64,new-image-data',
        filename: 'test-image.jpg',
        caption: 'test-image',
      });
      fixture.detectChanges();

      expect(component.form.get('dataUrl')?.value).toBe(
        'data:image/jpeg;base64,new-image-data',
      );
      expect(component.form.get('filename')?.value).toBe('test-image.jpg');
    });

    it('should dispatch imageFileLoadFailed action when file type is not supported', () => {
      const mockFile = new File([''], 'test-image.gif', { type: 'image/gif' });
      const mockEvent = { target: { files: [mockFile], value: '' } } as unknown as Event;

      component.onUploadNewImage(mockEvent);
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.imageFileLoadFailed({
          error: expect.objectContaining({
            message: expect.stringContaining('only PNG or JPEG'),
          }),
        }),
      );
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
        caption: '', // Invalid - required field
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
        caption: '',
      });

      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();
      fixture.detectChanges();

      expect(component.form.get('caption')?.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data when adding new image', async () => {
      const dialogOpenSpy = jest
        .spyOn(dialogService, 'open')
        .mockResolvedValue('confirm');

      component.originalImage = null; // Simulate a new image
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
            title: 'Confirm',
            body: `Add ${mockFormData.filename}`,
            confirmButtonText: 'Add',
          },
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(ImagesActions.addImageRequested());
    });

    it('should open confirmation dialog with correct data when updating an image', async () => {
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
            title: 'Confirm',
            body: `Update ${mockImage.filename}?`,
            confirmButtonText: 'Update',
          },
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.updateImageRequested({ imageId: mockImage.id }),
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
      expect(store.dispatch).not.toHaveBeenCalledWith(ImagesActions.addImageRequested());
      expect(store.dispatch).not.toHaveBeenCalledWith(
        ImagesActions.updateImageRequested({ imageId: mockImage.id }),
      );
    });
  });
});
