import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { pick, uniq } from 'lodash';
import * as uuid from 'uuid';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { IMAGE_FORM_DATA_PROPERTIES, INITIAL_IMAGE_FORM_DATA } from '@app/constants';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { LccError } from '@app/models';
import { DialogService, ImageFileService } from '@app/services';
import { ImagesActions } from '@app/store/images';
import { query } from '@app/utils';

import { ImageFormComponent } from './image-form.component';

describe('ImageFormComponent', () => {
  let fixture: ComponentFixture<ImageFormComponent>;
  let component: ImageFormComponent;

  let dialogService: DialogService;
  let imageFileService: ImageFileService;
  let store: MockStore;

  let cancelSpy: jest.SpyInstance;
  let dialogOpenSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  let fetchNewImageDataUrlSpy: jest.SpyInstance;
  let initFormSpy: jest.SpyInstance;
  let initFormValueChangeListenerSpy: jest.SpyInstance;
  let restoreSpy: jest.SpyInstance;
  let storeImageFileSpy: jest.SpyInstance;
  let submitSpy: jest.SpyInstance;
  let uuidSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
          },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ImageFormComponent);
        component = fixture.componentInstance;

        dialogService = TestBed.inject(DialogService);
        imageFileService = TestBed.inject(ImageFileService);
        store = TestBed.inject(MockStore);

        component.existingAlbums = [];
        component.hasUnsavedChanges = false;
        component.imageEntity = null;
        component.newImageFormData = null;
        fixture.detectChanges();

        cancelSpy = jest.spyOn(component, 'onCancel');
        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        dispatchSpy = jest.spyOn(store, 'dispatch');
        // @ts-expect-error Private class member
        fetchNewImageDataUrlSpy = jest.spyOn(component, 'fetchNewImageDataUrl');
        // @ts-expect-error Private class member
        initFormSpy = jest.spyOn(component, 'initForm');
        initFormValueChangeListenerSpy = jest.spyOn(
          component,
          // @ts-expect-error Private class member
          'initFormValueChangeListener',
        );
        restoreSpy = jest.spyOn(component, 'onRestore');
        storeImageFileSpy = jest.spyOn(imageFileService, 'storeImageFile');
        submitSpy = jest.spyOn(component, 'onSubmit');
        uuidSpy = jest.spyOn(uuid, 'v4');
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    beforeEach(() => uuidSpy.mockReturnValue('1234'));

    describe('when both imageEntity and newImageFormData are null', () => {
      beforeEach(() => {
        component.existingAlbums = uniq(MOCK_IMAGES.map(image => image.album));
        component.imageEntity = null;
        component.newImageFormData = null;
        fixture.detectChanges();

        jest.clearAllMocks();
        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with untouched values from INITIAL_IMAGE_FORM_DATA', () => {
        const expectedFormData = { ...INITIAL_IMAGE_FORM_DATA, id: 'new-1234' };

        for (const property of IMAGE_FORM_DATA_PROPERTIES) {
          expect(component.form.controls[property].value).toBe(
            expectedFormData[property],
          );
          expect(component.form.controls[property].untouched).toBe(true);
        }

        expect(uuidSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize newAlbumValue to an empty string', () => {
        expect(component.newAlbumValue).toBe('');
      });

      it('should not call fetchNewImageDataUrl', () => {
        expect(fetchNewImageDataUrlSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch fetchOriginalRequested', () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe('when imageEntity is null and newImageFormData is defined', () => {
      beforeEach(() => {
        component.existingAlbums = uniq(MOCK_IMAGES.map(image => image.album));
        component.imageEntity = null;
        component.newImageFormData = pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES);
        fixture.detectChanges();

        jest.clearAllMocks();
        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with untouched values from newImageFormData', () => {
        const expectedFormData = pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES);

        for (const property of IMAGE_FORM_DATA_PROPERTIES) {
          expect(component.form.controls[property].value).toBe(
            expectedFormData[property],
          );
          expect(component.form.controls[property].untouched).toBe(true);
        }

        expect(uuidSpy).not.toHaveBeenCalled();
      });

      it('should initialize newAlbumValue to an empty string', () => {
        expect(component.newAlbumValue).toBe('');
      });

      it('should call fetchNewImageDataUrl with the new image id', () => {
        expect(fetchNewImageDataUrlSpy).toHaveBeenCalledWith(MOCK_IMAGES[0].id);
      });

      it('should not dispatch fetchOriginalRequested', () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe('when imageEntity is defined (without unsaved changes)', () => {
      beforeEach(() => {
        component.existingAlbums = uniq(MOCK_IMAGES.map(image => image.album));
        component.imageEntity = {
          image: MOCK_IMAGES[0],
          formData: pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES),
        };
        fixture.detectChanges();

        jest.clearAllMocks();
        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with untouched values from imageEntity formData', () => {
        const expectedFormData = pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES);

        for (const property of IMAGE_FORM_DATA_PROPERTIES) {
          expect(component.form.controls[property].value).toBe(
            expectedFormData[property],
          );
          expect(component.form.controls[property].untouched).toBe(true);
        }

        expect(uuidSpy).not.toHaveBeenCalled();
      });

      it('should initialize newAlbumValue an empty string', () => {
        expect(component.newAlbumValue).toBe('');
      });

      it('should not call fetchNewImageDataUrl', () => {
        expect(fetchNewImageDataUrlSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch fetchOriginalRequested', () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });

    describe('when imageEntity is defined (with unsaved changes and undefined urls)', () => {
      beforeEach(() => {
        component.existingAlbums = uniq(MOCK_IMAGES.map(image => image.album));
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

        jest.clearAllMocks();
        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with touched values from imageEntity formData', () => {
        const expectedFormData = {
          id: MOCK_IMAGES[0].id,
          filename: MOCK_IMAGES[0].filename,
          caption: 'A new caption',
          album: 'A new album title',
          albumCover: true,
        };

        for (const property of IMAGE_FORM_DATA_PROPERTIES) {
          expect(component.form.controls[property].value).toBe(
            expectedFormData[property],
          );
          expect(component.form.controls[property].untouched).toBe(true);
        }

        expect(uuidSpy).not.toHaveBeenCalled();
      });

      it('should initialize newAlbumValue with the unsaved album value', () => {
        expect(component.newAlbumValue).toBe('A new album title');
      });

      it('should not call fetchNewImageDataUrl', () => {
        expect(fetchNewImageDataUrlSpy).not.toHaveBeenCalled();
      });

      it('should dispatch fetchOriginalRequested', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          ImagesActions.fetchOriginalRequested({ imageId: MOCK_IMAGES[0].id }),
        );
      });
    });
  });

  describe('form validation', () => {
    describe('required validator', () => {
      it('should mark empty field as invalid', () => {
        component.form.patchValue({ caption: '' });
        fixture.detectChanges();

        expect(component.form.controls.caption.hasError('required')).toBe(true);
      });

      it('should mark non-empty field as valid', () => {
        component.form.patchValue({ caption: 'Valid Caption' });
        fixture.detectChanges();

        expect(component.form.controls.caption.hasError('required')).toBe(false);
      });
    });

    describe('pattern validator', () => {
      it('should mark field with an invalid pattern as invalid', () => {
        component.form.patchValue({ album: '   ' });
        fixture.detectChanges();

        expect(component.form.controls.album.hasError('pattern')).toBe(true);
      });

      it('should mark field with a valid pattern as valid', () => {
        component.form.patchValue({ album: '🔥' });
        fixture.detectChanges();

        expect(component.form.controls.album.hasError('pattern')).toBe(false);
      });
    });

    describe('image caption validator', () => {
      it('should mark field with an out-of-range ASCII character as invalid', () => {
        component.form.patchValue({ caption: 'Żubrówka' });
        fixture.detectChanges();

        expect(component.form.controls.caption.hasError('invalidImageCaption')).toBe(
          true,
        );
      });

      it('should mark field without an out-of-range ASCII character as valid', () => {
        component.form.patchValue({ caption: 'Absolut' });
        fixture.detectChanges();

        expect(component.form.controls.caption.hasError('invalidImageCaption')).toBe(
          false,
        );
      });
    });
  });

  describe('albumExists', () => {
    it('should return true if current image form value is in existingAlbums array', () => {
      component.existingAlbums = uniq(MOCK_IMAGES.map(image => image.album));
      component.form.patchValue({ album: MOCK_IMAGES[3].album });
      fixture.detectChanges();

      expect(component.albumExists).toBe(true);
    });

    it('should return false if current image form value is NOT in existingAlbums array', () => {
      component.existingAlbums = uniq(MOCK_IMAGES.map(image => image.album));
      component.form.patchValue({ album: 'Some new value' });
      fixture.detectChanges();

      expect(component.albumExists).toBe(false);
    });
  });

  describe('onNewAlbumInputChange', () => {
    it('should update the newAlbumValue and patch image form control', () => {
      const inputElement = document.createElement('input');
      inputElement.value = 'New Album';
      const event = { target: inputElement };

      component.onNewAlbumInputChange(event as unknown as Event);

      expect(component.newAlbumValue).toBe('New Album');
      expect(component.form.controls.album.value).toBe('New Album');
    });
  });

  describe('onNewAlbumInputFocus', () => {
    it('should check the radio button and update image form control', () => {
      component.existingAlbums = uniq(MOCK_IMAGES.map(image => image.album));
      component.form.setValue(pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES));
      component.newAlbumValue = 'New album title';
      fixture.detectChanges();

      const radioElement = document.getElementById('new-album-input') as HTMLInputElement;
      expect(radioElement.checked).toBe(false);
      expect(component.form.controls.album.value).toBe(MOCK_IMAGES[3].album);

      component.onNewAlbumInputFocus();

      expect(radioElement.checked).toBe(true);
      expect(component.form.controls.album.value).toBe('New album title');
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
      expect(dispatchSpy).toHaveBeenCalledWith(
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

  describe('onRestore', () => {
    beforeEach(() => {
      component.hasUnsavedChanges = true;
      component.imageEntity = {
        image: MOCK_IMAGES[0],
        formData: pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES),
      };
      component.newImageFormData = pick(MOCK_IMAGES[1], IMAGE_FORM_DATA_PROPERTIES);
      component.newImageDataUrl = 'data:image/png;base64,abc';
      fixture.detectChanges();

      component.ngOnInit();

      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => jest.useRealTimers());

    it('should dispatch image form data reset and re-initialize form if dialog is confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

      await component.onRestore();
      jest.runAllTimers();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: false,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: 'Restore original image data? All changes will be lost.',
            confirmButtonText: 'Restore',
            confirmButtonType: 'warning',
          },
        },
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        ImagesActions.imageFormDataReset({ imageId: MOCK_IMAGES[0].id }),
      );
      expect(initFormSpy).toHaveBeenCalledTimes(1);
      expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);

      // Verify formValueChanged was dispatched at least once
      const formValueChangedCalls = dispatchSpy.mock.calls.filter(
        call => call[0].type === ImagesActions.formValueChanged.type,
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

  describe('onCancel', () => {
    it('should dispatch cancelSelected action', () => {
      component.onCancel();
      expect(dispatchSpy).toHaveBeenCalledWith(ImagesActions.cancelSelected());
    });
  });

  describe('onSubmit', () => {
    it('should mark all fields as touched if form is invalid on submit', async () => {
      component.form.patchValue({ caption: '' }); // Invalid - caption field is required
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();

      expect(component.form.controls.caption.touched).toBe(true);
      expect(component.form.controls.album.touched).toBe(true);
      expect(component.form.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data if adding a new image', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      component.form.patchValue(pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES));
      component.newImageFormData = MOCK_IMAGES[3];
      fixture.detectChanges();

      await component.onSubmit();

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
      expect(dispatchSpy).toHaveBeenCalledWith(
        ImagesActions.addImageRequested({ imageId: MOCK_IMAGES[3].id }),
      );
    });

    it('should open confirmation dialog with correct data if updating an image', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      component.imageEntity = {
        image: MOCK_IMAGES[3],
        formData: pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES),
      };
      component.form.patchValue(component.imageEntity.formData);
      fixture.detectChanges();

      await component.onSubmit();

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
      expect(dispatchSpy).toHaveBeenCalledWith(
        ImagesActions.updateImageRequested({ imageId: MOCK_IMAGES[3].id }),
      );
    });

    it('should not dispatch action if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      component.hasUnsavedChanges = true;
      component.newImageFormData = MOCK_IMAGES[3];
      component.form.patchValue(pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES));
      fixture.detectChanges();

      await component.onSubmit();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        ImagesActions.addImageRequested({ imageId: MOCK_IMAGES[3].id }),
      );
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        ImagesActions.updateImageRequested({ imageId: MOCK_IMAGES[3].id }),
      );
    });
  });

  describe('template rendering', () => {
    describe('modification info', () => {
      it('should render if imageEntity is defined', () => {
        component.imageEntity = {
          image: MOCK_IMAGES[0],
          formData: pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES),
        };
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).not.toBeNull();
      });

      it('should not render if imageEntity is null', () => {
        component.imageEntity = null;
        fixture.detectChanges();

        expect(query(fixture.debugElement, 'lcc-modification-info')).toBeNull();
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
        component.form.setValue(pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES));
        component.hasUnsavedChanges = false;
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be disabled if the form is invalid', () => {
        component.form.setValue({
          ...pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES),
          caption: '', // Invalid - caption is a required field
        });
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(true);
      });

      it('should be enabled if there are unsaved changes and the form is valid', () => {
        dialogOpenSpy.mockResolvedValue('cancel');
        component.form.setValue(pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES));
        component.hasUnsavedChanges = true;
        fixture.detectChanges();

        query(fixture.debugElement, 'form').triggerEventHandler('ngSubmit');

        const submitButton = query(fixture.debugElement, '.submit-button');
        expect(submitButton.nativeElement.disabled).toBe(false);
        expect(submitSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
