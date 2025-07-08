import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { pick } from 'lodash';
import * as uuid from 'uuid';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { IMAGE_FORM_DATA_PROPERTIES, INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { LccError } from '@app/models';
import { DialogService, ImageFileService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { query } from '@app/utils';

import { ImageFormComponent } from './image-form.component';

describe('ImageFormComponent', () => {
  let fixture: ComponentFixture<ImageFormComponent>;
  let component: ImageFormComponent;
  let store: MockStore;
  let dialogService: DialogService;
  let imageFileService: ImageFileService;

  let fetchNewImageDataUrlSpy: jest.SpyInstance;
  let initFormSpy: jest.SpyInstance;
  let initFormValueChangeListenerSpy: jest.SpyInstance;
  let storeImageFileSpy: jest.SpyInstance;
  let uuidSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: DialogService, useValue: { open: jest.fn() } },
        {
          provide: ImageFileService,
          useValue: {
            storeImageFile: jest.fn(),
            getImage: jest.fn(),
            deleteImage: jest.fn(),
            clearAllImages: jest.fn(),
          },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ImageFormComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);

        dialogService = TestBed.inject(DialogService);
        imageFileService = TestBed.inject(ImageFileService);

        component.existingAlbums = MOCK_IMAGES.map(image => image.album);
        component.hasUnsavedChanges = false;
        component.imageEntity = null;
        component.newImageFormData = null;

        // @ts-expect-error Private class member
        fetchNewImageDataUrlSpy = jest.spyOn(component, 'fetchNewImageDataUrl');
        // @ts-expect-error Private class member
        initFormSpy = jest.spyOn(component, 'initForm');
        initFormValueChangeListenerSpy = jest.spyOn(
          component,
          // @ts-expect-error Private class member
          'initFormValueChangeListener',
        );
        storeImageFileSpy = jest.spyOn(imageFileService, 'storeImageFile');

        uuidSpy = jest
          .spyOn(uuid, 'v4')
          .mockReturnValue('1234' as unknown as Uint8Array<ArrayBufferLike>);

        jest.spyOn(store, 'dispatch');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    describe('when both imageEntity and newImageFormData are null', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with untouched values from INITIAL_IMAGE_FORM_DATA', () => {
        const expectedFormData = { ...INITIAL_IMAGE_FORM_DATA, id: 'new-1234' };

        for (const property in expectedFormData) {
          expect(
            component.form.controls[property as keyof typeof component.form.controls]
              .value,
          ).toBe(expectedFormData[property as keyof typeof expectedFormData]);

          expect(
            component.form.controls[property as keyof typeof component.form.controls]
              .untouched,
          ).toBe(true);
        }

        expect(uuidSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize newAlbumValue to an empty string', () => {
        expect(component.newAlbumValue).toBe('');
      });

      it('should not call fetchNewImageDataUrl', () => {
        expect(fetchNewImageDataUrlSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch fetchImageRequested', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when imageEntity is null and newImageFormData is defined', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component.newImageFormData = pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES);
        fixture.detectChanges();

        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with untouched values from newImageFormData', () => {
        const expectedFormData = component.newImageFormData;

        for (const property in expectedFormData) {
          expect(
            component.form.controls[property as keyof typeof component.form.controls]
              .value,
          ).toBe(expectedFormData[property as keyof typeof expectedFormData]);

          expect(
            component.form.controls[property as keyof typeof component.form.controls]
              .untouched,
          ).toBe(true);
        }

        expect(uuidSpy).not.toHaveBeenCalled();
      });

      it('should initialize newAlbumValue to an empty string', () => {
        expect(component.newAlbumValue).toBe('');
      });

      it('should call fetchNewImageDataUrl with the new image id', () => {
        expect(fetchNewImageDataUrlSpy).toHaveBeenCalledWith(MOCK_IMAGES[0].id);
      });

      it('should not dispatch fetchImageRequested', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when imageEntity is defined (without unsaved changes)', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component.imageEntity = {
          image: MOCK_IMAGES[0],
          formData: pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES),
        };
        fixture.detectChanges();

        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with untouched values from imageEntity formData', () => {
        const expectedFormData = component.imageEntity?.formData;

        for (const property in expectedFormData) {
          expect(
            component.form.controls[property as keyof typeof component.form.controls]
              .value,
          ).toBe(expectedFormData[property as keyof typeof expectedFormData]);

          expect(
            component.form.controls[property as keyof typeof component.form.controls]
              .untouched,
          ).toBe(true);
        }

        expect(uuidSpy).not.toHaveBeenCalled();
      });

      it('should initialize newAlbumValue an empty string', () => {
        expect(component.newAlbumValue).toBe('');
      });

      it('should not call fetchNewImageDataUrl', () => {
        expect(fetchNewImageDataUrlSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch fetchImageRequested', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when imageEntity is defined (with unsaved changes and undefined urls)', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component.hasUnsavedChanges = true;
        component.imageEntity = {
          image: {
            ...MOCK_IMAGES[0],
            originalUrl: undefined,
            thumbnailUrl: undefined,
          },
          formData: {
            id: MOCK_IMAGES[0].id,
            filename: MOCK_IMAGES[0].filename,
            caption: 'A new caption',
            album: 'A new album title',
            albumCover: true,
          },
        };
        fixture.detectChanges();

        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with touched values from imageEntity formData', () => {
        const expectedFormData = component.imageEntity?.formData;

        for (const property in expectedFormData) {
          expect(
            component.form.controls[property as keyof typeof component.form.controls]
              .value,
          ).toBe(expectedFormData[property as keyof typeof expectedFormData]);

          expect(
            component.form.controls[property as keyof typeof component.form.controls]
              .touched,
          ).toBe(true);
        }

        expect(uuidSpy).not.toHaveBeenCalled();
      });

      it('should initialize newAlbumValue with the unsaved album value', () => {
        expect(component.newAlbumValue).toBe('A new album title');
      });

      it('should not call fetchNewImageDataUrl', () => {
        expect(fetchNewImageDataUrlSpy).not.toHaveBeenCalled();
      });

      it('should dispatch fetchImageRequested', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          ImagesActions.fetchImageRequested({ imageId: MOCK_IMAGES[0].id }),
        );
      });
    });
  });

  describe('form validation', () => {
    describe('required validator', () => {
      it('should mark empty field as invalid', () => {
        component.form.patchValue({ caption: '' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.caption.hasError('required')).toBe(true);
      });

      it('should mark non-empty field as valid', () => {
        component.form.patchValue({ caption: 'Valid Caption' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.caption.hasError('required')).toBe(false);
      });
    });

    describe('pattern validator', () => {
      it('should mark field with an invalid pattern as invalid', () => {
        component.form.patchValue({ album: '   ' });
        component.form.controls.album.markAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.album.hasError('pattern')).toBe(true);
      });

      it('should mark field with a valid pattern as valid', () => {
        component.form.patchValue({ album: '🔥' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.album.hasError('pattern')).toBe(false);
      });
    });

    describe('image caption validator', () => {
      it('should mark field with an out-of-range ASCII character as invalid', () => {
        component.form.patchValue({ caption: 'Żubrówka' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.caption.hasError('invalidImageCaption')).toBe(
          true,
        );
      });

      it('should mark field without an out-of-range ASCII character as valid', () => {
        component.form.patchValue({ caption: 'Absolut' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(component.form.controls.caption.hasError('invalidImageCaption')).toBe(
          false,
        );
      });
    });
  });

  describe('albumExists', () => {
    it('should return true if current album form value is in existingAlbums array', () => {
      component.form.patchValue({ album: MOCK_IMAGES[3].album });
      fixture.detectChanges();

      expect(component.albumExists).toBe(true);
    });

    it('should return false if current album form value is NOT in existingAlbums array', () => {
      component.form.patchValue({ album: 'Some new value' });
      fixture.detectChanges();

      expect(component.albumExists).toBe(false);
    });
  });

  describe('onNewAlbumInputChange', () => {
    it('should update the newAlbumValue and patch album form control', () => {
      const inputElement = document.createElement('input');
      inputElement.value = 'New Album';
      const event = { target: inputElement };

      component.onNewAlbumInputChange(event as unknown as Event);

      expect(component.newAlbumValue).toBe('New Album');
      expect(component.form.controls.album.value).toBe('New Album');
    });
  });

  describe('onNewAlbumInputFocus', () => {
    it('should check the radio button and update album form control', () => {
      document.body.innerHTML = '<input type="radio" id="new-album-input">';
      const radioElement = document.getElementById('new-album-input') as HTMLInputElement;

      component.newAlbumValue = 'Focused Album';
      component.onNewAlbumInputFocus();

      expect(radioElement.checked).toBe(true);
      expect(component.form.controls.album.value).toBe('Focused Album');
    });
  });

  describe('onChooseFile', () => {
    it('should process the selected file and update form values', async () => {
      const file = new File([':)'], 'file.name.png', { type: 'image/png' });
      const fileInputElement = document.createElement('input');
      Object.defineProperty(fileInputElement, 'files', {
        value: [file],
        writable: true,
      });
      const event = { target: fileInputElement };

      storeImageFileSpy.mockResolvedValue({
        id: 'new-1234',
        filename: 'file.name.png',
        dataUrl: 'data:image/png;base64,xyz',
      });

      await component.onChooseFile(event as unknown as Event);
      fixture.detectChanges();

      expect(storeImageFileSpy).toHaveBeenCalledTimes(1);
      expect(fileInputElement.value).toBe('');
      expect(component.newImageDataUrl).toBe('data:image/png;base64,xyz');
      expect(component.form.controls.filename.value).toBe('file.name.png');
      expect(component.form.controls.caption.value).toBe('file.name');
    });

    it('should handle errors from the imageFileService', async () => {
      const file = new File(['test'], 'error.png', { type: 'image/png' });
      const fileInputElement = document.createElement('input');
      Object.defineProperty(fileInputElement, 'files', {
        value: [file],
        writable: true,
      });
      const event = { target: fileInputElement };
      const error: LccError = {
        name: 'LCCError' as const,
        message: 'File processing error',
      };

      storeImageFileSpy.mockResolvedValue(error);

      await component.onChooseFile(event as unknown as Event);
      fixture.detectChanges();

      expect(storeImageFileSpy).toHaveBeenCalledTimes(1);
      expect(fileInputElement.value).toBe('');
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.imageFileActionFailed({ error }),
      );
    });

    it('should do nothing if no file is selected', async () => {
      const fileInputElement = document.createElement('input');
      Object.defineProperty(fileInputElement, 'files', {
        value: [],
        writable: true,
      });
      const event = { target: fileInputElement };

      await component.onChooseFile(event as unknown as Event);
      fixture.detectChanges();

      expect(storeImageFileSpy).not.toHaveBeenCalled();
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
      component.form.patchValue(pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES));
      component.hasUnsavedChanges = false;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
        true,
      );
    });

    it('should be disabled when the form is invalid', () => {
      component.form.patchValue(pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES));
      component.form.patchValue({
        caption: '', // Invalid - required field
      });
      component.hasUnsavedChanges = true;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
        true,
      );
    });

    it('should be enabled when there are unsaved changes and the form is valid', () => {
      component.form.patchValue(pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES));
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
      component.form.patchValue({ caption: '' });
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();
      fixture.detectChanges();

      expect(component.form.controls.id.touched).toBe(true);
      expect(component.form.controls.caption.touched).toBe(true);
      expect(component.form.controls.albumCover.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data when adding a new image', async () => {
      const dialogOpenSpy = jest
        .spyOn(dialogService, 'open')
        .mockResolvedValue('confirm');
      component.hasUnsavedChanges = true;
      component.newImageFormData = MOCK_IMAGES[3];
      component.form.patchValue(pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES));
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
            body: `Add ${MOCK_IMAGES[3].filename} to ${MOCK_IMAGES[3].album}?`,
            confirmButtonText: 'Add',
          },
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.addImageRequested({ imageId: MOCK_IMAGES[3].id }),
      );
    });

    it('should open confirmation dialog with correct data when updating an image', async () => {
      const dialogOpenSpy = jest
        .spyOn(dialogService, 'open')
        .mockResolvedValue('confirm');
      component.hasUnsavedChanges = true;
      component.imageEntity = {
        image: MOCK_IMAGES[3],
        formData: pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES),
      };
      component.form.patchValue(pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES));
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
            body: `Update ${MOCK_IMAGES[3].filename}?`,
            confirmButtonText: 'Update',
          },
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.updateImageRequested({ imageId: MOCK_IMAGES[3].id }),
      );
    });

    it('should not dispatch action if dialog is cancelled', async () => {
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockResolvedValue('cancel');
      component.hasUnsavedChanges = true;
      component.newImageFormData = MOCK_IMAGES[3];
      component.form.patchValue(pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES));
      fixture.detectChanges();

      const form = fixture.debugElement.query(selector => selector.name === 'form');
      form.triggerEventHandler('ngSubmit');

      await fixture.whenStable();
      fixture.detectChanges();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(store.dispatch).not.toHaveBeenCalledWith(
        ImagesActions.addImageRequested({ imageId: MOCK_IMAGES[3].id }),
      );
      expect(store.dispatch).not.toHaveBeenCalledWith(
        ImagesActions.updateImageRequested({ imageId: MOCK_IMAGES[3].id }),
      );
    });
  });
});
