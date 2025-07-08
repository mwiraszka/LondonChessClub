import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { pick } from 'lodash';
import * as uuid from 'uuid';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { IMAGE_FORM_DATA_PROPERTIES } from '@app/constants';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { LccError } from '@app/models';
import { DialogService, ImageFileService } from '@app/services';
import { ImagesActions } from '@app/store/images';
import { query, queryTextContent } from '@app/utils';

import { AlbumFormComponent } from './album-form.component';

describe('AlbumFormComponent', () => {
  let fixture: ComponentFixture<AlbumFormComponent>;
  let component: AlbumFormComponent;
  let store: MockStore;
  let dialogService: DialogService;
  let imageFileService: ImageFileService;

  let dialogOpenSpy: jest.SpyInstance;
  let storeImageFileSpy: jest.SpyInstance;
  let fetchNewImageDataUrlsSpy: jest.SpyInstance;
  let initFormSpy: jest.SpyInstance;
  let initFormValueChangeListenerSpy: jest.SpyInstance;
  let uuidSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: DialogService, useValue: { open: jest.fn() } },
        {
          provide: ImageFileService,
          useValue: {
            storeImageFile: jest.fn(),
            getAllImages: jest.fn(),
            deleteImage: jest.fn(),
            clearAllImages: jest.fn(),
          },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AlbumFormComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        dialogService = TestBed.inject(DialogService);
        imageFileService = TestBed.inject(ImageFileService);

        component.album = null;
        component.existingAlbums = MOCK_IMAGES.map(image => image.album);
        component.hasUnsavedChanges = false;
        component.imageEntities = [];
        component.newImagesFormData = {};

        jest.spyOn(imageFileService, 'getAllImages').mockResolvedValue([
          {
            id: 'new-123',
            filename: 'my-dog.png',
            dataUrl: 'data:image/png;base64,abc',
          },
          {
            id: 'new-456',
            filename: 'my-cat.jpeg',
            dataUrl: 'data:image/jpeg;base64,xyz',
          },
        ]);

        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        // @ts-expect-error Private class member
        fetchNewImageDataUrlsSpy = jest.spyOn(component, 'fetchNewImageDataUrls');
        // @ts-expect-error Private class member
        initFormSpy = jest.spyOn(component, 'initForm');
        initFormValueChangeListenerSpy = jest.spyOn(
          component,
          // @ts-expect-error Private class member
          'initFormValueChangeListener',
        );
        storeImageFileSpy = jest.spyOn(imageFileService, 'storeImageFile');
        uuidSpy = jest.spyOn(uuid, 'v4');

        jest.spyOn(store, 'dispatch');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI elements', () => {
    it('should not render new images header when album is null', () => {
      expect(query(fixture.debugElement, '.new-images-header')).toBeNull();
    });

    it('should render new images header when album is defined', () => {
      component.album = 'My album';
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.new-images-header')).toBe(
        'New images',
      );
    });
  });

  describe('form initialization', () => {
    describe('when both imageEntities and newImagesFormData are empty', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with empty, untouched values', () => {
        expect(component.form.controls.album.value).toBe('');
        expect(component.form.controls.existingImages.value).toStrictEqual([]);
        expect(component.form.controls.newImages.value).toStrictEqual([]);

        expect(component.form.controls.album.untouched).toBe(true);
        expect(component.form.controls.existingImages.untouched).toBe(true);
        expect(component.form.controls.newImages.untouched).toBe(true);
      });

      it('should not call fetchNewImagesDataUrls', () => {
        expect(fetchNewImageDataUrlsSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch fetchImageRequested', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when imageEntities is empty and newImagesFormData contains data', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        // Two images from the same album
        component.newImagesFormData = {
          [MOCK_IMAGES[0].id]: pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES),
          [MOCK_IMAGES[3].id]: pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES),
        };
        fixture.detectChanges();

        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with untouched values from newImageFormData', () => {
        expect(component.form.controls.album.value).toBe(MOCK_IMAGES[0].album);
        expect(component.form.controls.existingImages.value).toStrictEqual([]);

        const newImage1 = component.form.controls.newImages.at(0);
        expect(newImage1.controls.id.value).toBe(MOCK_IMAGES[0].id);
        expect(newImage1.controls.filename.value).toBe(MOCK_IMAGES[0].filename);
        expect(newImage1.controls.caption.value).toBe(MOCK_IMAGES[0].caption);
        expect(newImage1.controls.albumCover.value).toBe(MOCK_IMAGES[0].albumCover);

        const newImage2 = component.form.controls.newImages.at(1);
        expect(newImage2.controls.id.value).toBe(MOCK_IMAGES[3].id);
        expect(newImage2.controls.filename.value).toBe(MOCK_IMAGES[3].filename);
        expect(newImage2.controls.caption.value).toBe(MOCK_IMAGES[3].caption);
        expect(newImage2.controls.albumCover.value).toBe(MOCK_IMAGES[3].albumCover);

        expect(component.form.controls.album.untouched).toBe(true);
        expect(component.form.controls.existingImages.untouched).toBe(true);
        expect(component.form.controls.newImages.untouched).toBe(true);
      });

      it('should call fetchNewImagesDataUrls', () => {
        expect(fetchNewImageDataUrlsSpy).toHaveBeenCalledTimes(1);
      });

      it('should not dispatch fetchImageRequested', () => {
        expect(store.dispatch).not.toHaveBeenCalledWith(
          ImagesActions.fetchImagesRequested({
            imageIds: [MOCK_IMAGES[0].id, MOCK_IMAGES[3].id],
          }),
        );
      });
    });

    describe('when imageEntities contains data (without unsaved changes)', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component.imageEntities = [
          {
            image: MOCK_IMAGES[0],
            formData: pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES),
          },
          {
            image: MOCK_IMAGES[3],
            formData: pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES),
          },
        ];
        fixture.detectChanges();

        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with untouched values from imageEntities formData', () => {
        expect(component.form.controls.album.value).toBe(MOCK_IMAGES[0].album);
        expect(component.form.controls.newImages.value).toStrictEqual([]);

        const existingImage1 = component.form.controls.existingImages.at(0);
        expect(existingImage1.controls.id.value).toBe(MOCK_IMAGES[0].id);
        expect(existingImage1.controls.filename.value).toBe(MOCK_IMAGES[0].filename);
        expect(existingImage1.controls.caption.value).toBe(MOCK_IMAGES[0].caption);
        expect(existingImage1.controls.albumCover.value).toBe(MOCK_IMAGES[0].albumCover);

        const existingImage2 = component.form.controls.existingImages.at(1);
        expect(existingImage2.controls.id.value).toBe(MOCK_IMAGES[3].id);
        expect(existingImage2.controls.filename.value).toBe(MOCK_IMAGES[3].filename);
        expect(existingImage2.controls.caption.value).toBe(MOCK_IMAGES[3].caption);
        expect(existingImage2.controls.albumCover.value).toBe(MOCK_IMAGES[3].albumCover);

        expect(component.form.controls.album.untouched).toBe(true);
        expect(component.form.controls.existingImages.untouched).toBe(true);
        expect(component.form.controls.newImages.untouched).toBe(true);
      });

      it('should not call fetchNewImagesDataUrls', () => {
        expect(fetchNewImageDataUrlsSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch fetchImageRequested', () => {
        expect(store.dispatch).not.toHaveBeenCalledWith(
          ImagesActions.fetchImagesRequested({
            imageIds: [MOCK_IMAGES[0].id, MOCK_IMAGES[3].id],
          }),
        );
      });
    });

    describe('when imageEntities contains data (with some unsaved changes and undefined urls)', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component.hasUnsavedChanges = true;
        component.imageEntities = [
          {
            image: MOCK_IMAGES[0],
            formData: {
              id: MOCK_IMAGES[0].id,
              filename: MOCK_IMAGES[0].filename,
              caption: 'A new caption',
              album: 'A new album title',
              albumCover: true,
            },
          },
          {
            image: {
              ...MOCK_IMAGES[3],
              originalUrl: undefined,
              thumbnailUrl: undefined,
            },
            formData: {
              ...pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES),
              album: 'A new album title',
            },
          },
        ];
        fixture.detectChanges();

        component.ngOnInit();
      });

      it('should initialize form and its value change listener', () => {
        expect(initFormSpy).toHaveBeenCalledTimes(1);
        expect(initFormValueChangeListenerSpy).toHaveBeenCalledTimes(1);
      });

      it('should initialize the form with touched values from imageEntities formData', () => {
        expect(component.form.controls.album.value).toBe('A new album title');
        expect(component.form.controls.newImages.value).toStrictEqual([]);

        const existingImage1 = component.form.controls.existingImages.at(0);
        expect(existingImage1.controls.id.value).toBe(MOCK_IMAGES[0].id);
        expect(existingImage1.controls.filename.value).toBe(MOCK_IMAGES[0].filename);
        expect(existingImage1.controls.caption.value).toBe('A new caption');
        expect(existingImage1.controls.albumCover.value).toBe(MOCK_IMAGES[0].albumCover);

        const existingImage2 = component.form.controls.existingImages.at(1);
        expect(existingImage2.controls.id.value).toBe(MOCK_IMAGES[3].id);
        expect(existingImage2.controls.filename.value).toBe(MOCK_IMAGES[3].filename);
        expect(existingImage2.controls.caption.value).toBe(MOCK_IMAGES[3].caption);
        expect(existingImage2.controls.albumCover.value).toBe(MOCK_IMAGES[3].albumCover);

        expect(component.form.controls.album.touched).toBe(true);
        expect(component.form.controls.existingImages.touched).toBe(true);
        expect(component.form.controls.newImages.touched).toBe(true);
      });

      it('should not call fetchNewImagesDataUrls', () => {
        expect(store.dispatch).not.toHaveBeenCalledWith(
          ImagesActions.fetchImagesRequested({
            imageIds: [MOCK_IMAGES[0].id, MOCK_IMAGES[3].id],
          }),
        );
      });

      it('should dispatch fetchImageRequested only for the image with undefined urls', () => {
        expect(store.dispatch).toHaveBeenCalledWith(
          ImagesActions.fetchImagesRequested({ imageIds: [MOCK_IMAGES[3].id] }),
        );
      });
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      // Two images from the same album
      component.newImagesFormData = {
        [MOCK_IMAGES[0].id]: pick(MOCK_IMAGES[0], IMAGE_FORM_DATA_PROPERTIES),
        [MOCK_IMAGES[3].id]: pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES),
      };
      fixture.detectChanges();

      component.ngOnInit();
    });

    describe('required validator', () => {
      it('should mark empty field as invalid', () => {
        component.form.controls.newImages.at(0).patchValue({ caption: '' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(
          component.form.controls.newImages.at(0).controls.caption.hasError('required'),
        ).toBe(true);
      });

      it('should mark non-empty field as valid', () => {
        component.form.controls.newImages.at(0).patchValue({ caption: 'Valid caption' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(
          component.form.controls.newImages.at(0).controls.caption.hasError('required'),
        ).toBe(false);
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
        component.form.controls.newImages.at(0).patchValue({ caption: 'Żubrówka' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(
          component.form.controls.newImages
            .at(0)
            .controls.caption.hasError('invalidImageCaption'),
        ).toBe(true);
      });

      it('should mark field without an out-of-range ASCII character as valid', () => {
        component.form.controls.newImages.at(0).patchValue({ caption: 'Absolut' });
        component.form.markAllAsTouched();
        fixture.detectChanges();

        expect(
          component.form.controls.newImages
            .at(0)
            .controls.caption.hasError('invalidImageCaption'),
        ).toBe(false);
      });
    });
  });

  describe('onSetAlbumCover', () => {
    it('should correctly set albumCover to false on current image and to true on new image', () => {
      // Images from the same album
      component.newImagesFormData = {
        [MOCK_IMAGES[1].id]: pick(MOCK_IMAGES[1], IMAGE_FORM_DATA_PROPERTIES),
        [MOCK_IMAGES[2].id]: pick(MOCK_IMAGES[2], IMAGE_FORM_DATA_PROPERTIES),
        [MOCK_IMAGES[5].id]: pick(MOCK_IMAGES[5], IMAGE_FORM_DATA_PROPERTIES), // Current album cover
      };
      fixture.detectChanges();

      component.ngOnInit();

      const newImages = component.form.controls.newImages;
      expect(newImages.at(0).controls.albumCover.value).toBe(false);
      expect(newImages.at(1).controls.albumCover.value).toBe(false);
      expect(newImages.at(2).controls.albumCover.value).toBe(true);

      component.onSetAlbumCover(MOCK_IMAGES[2].id);
      fixture.detectChanges();

      expect(newImages.at(0).controls.albumCover.value).toBe(false);
      expect(newImages.at(1).controls.albumCover.value).toBe(true);
      expect(newImages.at(2).controls.albumCover.value).toBe(false);
    });
  });

  describe('onChooseFiles', () => {
    it('should process a single file and update form values', async () => {
      const file = new File([':)'], 'new-file.1.png', { type: 'image/png' });
      const fileInputElement = document.createElement('input');
      Object.defineProperty(fileInputElement, 'files', {
        value: [file],
        writable: true,
      });
      const event = { target: fileInputElement };

      storeImageFileSpy.mockResolvedValue({
        id: 'new-7777',
        filename: 'new-file.1.png',
        dataUrl: 'data:image/png;base64,abc',
      });

      await component.onChooseFiles(event as unknown as Event);
      await fixture.whenStable();

      expect(uuidSpy).toHaveBeenCalledTimes(1);
      expect(storeImageFileSpy).toHaveBeenCalledTimes(1);
      expect(component.newImageDataUrls).toEqual({
        'new-7777': 'data:image/png;base64,abc',
      });
      expect(fileInputElement.value).toBe('');

      const newImagesControl = component.form.controls.newImages;
      expect(newImagesControl.at(0).controls.id.value).toBe('new-7777');
      expect(newImagesControl.at(0).controls.filename.value).toBe('new-file.1.png');
      expect(newImagesControl.at(0).controls.caption.value).toBe('new-file.1');
    });

    it('should process multiple files and update form values', async () => {
      const file1 = new File([':)'], 'new-file.1.png', { type: 'image/png' });
      const file2 = new File([':)'], 'new-file.2.jpg', { type: 'image/jpeg' });
      const fileInputElement = document.createElement('input');
      Object.defineProperty(fileInputElement, 'files', {
        value: [file1, file2],
        writable: true,
      });
      const event = { target: fileInputElement };

      storeImageFileSpy
        .mockResolvedValueOnce({
          id: 'new-7777',
          filename: 'new-file.1.png',
          dataUrl: 'data:image/png;base64,abc',
        })
        .mockResolvedValueOnce({
          id: 'new-8888',
          filename: 'new-file.2.jpg',
          dataUrl: 'data:image/jpeg;base64,xyz',
        });

      await component.onChooseFiles(event as unknown as Event);
      await fixture.whenStable();

      expect(uuidSpy).toHaveBeenCalledTimes(2);
      expect(storeImageFileSpy).toHaveBeenCalledTimes(2);
      expect(component.newImageDataUrls).toEqual({
        'new-7777': 'data:image/png;base64,abc',
        'new-8888': 'data:image/jpeg;base64,xyz',
      });
      expect(fileInputElement.value).toBe('');

      const newImagesControl = component.form.controls.newImages;
      expect(newImagesControl.at(0).controls.id.value).toBe('new-7777');
      expect(newImagesControl.at(0).controls.filename.value).toBe('new-file.1.png');
      expect(newImagesControl.at(0).controls.caption.value).toBe('new-file.1');
      expect(newImagesControl.at(1).controls.id.value).toBe('new-8888');
      expect(newImagesControl.at(1).controls.filename.value).toBe('new-file.2.jpg');
      expect(newImagesControl.at(1).controls.caption.value).toBe('new-file.2');
    });

    it('should handle errors from the imageFileService', async () => {
      const file1 = new File([':)'], 'new-file.1.png', { type: 'image/png' });
      const file2 = new File([':('], 'new-file.2.tiff', { type: 'image/tiff' });
      const file3 = new File([':)'], 'new-file.3.jpg', { type: 'image/jpeg' });
      const fileInputElement = document.createElement('input');
      Object.defineProperty(fileInputElement, 'files', {
        value: [file1, file2, file3],
        writable: true,
      });
      const event = { target: fileInputElement };
      const error: LccError = {
        name: 'LCCError' as const,
        message: 'Error message',
      };

      storeImageFileSpy
        .mockResolvedValueOnce({
          id: 'new-123',
          filename: 'new-file.1.png',
          dataUrl: 'data:image/png;base64,abc',
        })
        .mockResolvedValueOnce(error)
        .mockResolvedValueOnce({
          id: 'new-456',
          filename: 'new-file.3.jpg',
          dataUrl: 'data:image/jpeg;base64,xyz',
        });

      await component.onChooseFiles(event as unknown as Event);
      await fixture.whenStable();

      expect(storeImageFileSpy).toHaveBeenCalledTimes(3);
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.imageFileActionFailed({ error }),
      );
      expect(fileInputElement.value).toBe('');
      const newImagesControl = component.form.controls.newImages;
      expect(newImagesControl.at(0).controls.id.value).toBe('new-123');
      expect(newImagesControl.at(0).controls.filename.value).toBe('new-file.1.png');
      expect(newImagesControl.at(0).controls.caption.value).toBe('new-file.1');
      expect(newImagesControl.at(1).controls.id.value).toBe('new-456');
      expect(newImagesControl.at(1).controls.filename.value).toBe('new-file.3.jpg');
      expect(newImagesControl.at(1).controls.caption.value).toBe('new-file.3');
    });

    it('should do nothing if no file is selected', async () => {
      const fileInputElement = document.createElement('input');
      Object.defineProperty(fileInputElement, 'files', {
        value: [],
        writable: true,
      });
      const event = { target: fileInputElement };

      await component.onChooseFiles(event as unknown as Event);
      fixture.detectChanges();

      expect(storeImageFileSpy).not.toHaveBeenCalled();
    });
  });

  describe('cancel button', () => {
    it('should dispatch cancelSelected action when pressed', () => {
      query(fixture.debugElement, '.cancel-button').triggerEventHandler('click');
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(ImagesActions.cancelSelected());
    });
  });

  describe('submit button', () => {
    it('should be disabled when there are no unsaved changes', () => {
      component.newImagesFormData = { [MOCK_IMAGES[3].id]: MOCK_IMAGES[3] };
      component.hasUnsavedChanges = false;
      component.ngOnInit();
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
        true,
      );
    });

    it('should be disabled when the form is invalid', () => {
      component.newImagesFormData = {
        [MOCK_IMAGES[0].id]: {
          ...MOCK_IMAGES[0],
          caption: '', // Invalid - required field
        },
      };
      component.hasUnsavedChanges = true;
      component.ngOnInit();
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
        true,
      );
    });

    it('should be enabled when there are unsaved changes and the form is valid', () => {
      component.newImagesFormData = { [MOCK_IMAGES[3].id]: MOCK_IMAGES[3] };
      component.hasUnsavedChanges = true;
      component.ngOnInit();
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.submit-button').nativeElement.disabled).toBe(
        false,
      );
    });
  });

  describe('form submission', () => {
    it('should mark all fields as touched if form is invalid on submit', async () => {
      component.form.patchValue({ album: '' });
      component.form.markAsPristine();
      component.form.markAsUntouched();
      fixture.detectChanges();

      await component.onSubmit();
      fixture.detectChanges();

      expect(component.form.controls.album.touched).toBe(true);
      expect(component.form.controls.newImages.touched).toBe(true);
      expect(component.form.controls.existingImages.touched).toBe(true);
      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct data when adding a new image', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      component.hasUnsavedChanges = true;
      component.newImagesFormData = { [MOCK_IMAGES[3].id]: MOCK_IMAGES[3] };
      component.ngOnInit();
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
            body: 'Create new album with this 1 new image?',
            confirmButtonText: 'Create',
          },
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(ImagesActions.addImagesRequested());
    });

    it('should open confirmation dialog with correct data when updating an image', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      component.album = MOCK_IMAGES[3].album;
      component.hasUnsavedChanges = true;
      component.imageEntities = [
        {
          image: MOCK_IMAGES[3],
          formData: pick(MOCK_IMAGES[3], IMAGE_FORM_DATA_PROPERTIES),
        },
      ];
      component.ngOnInit();
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
            body: `Update ${MOCK_IMAGES[3].album}?`,
            confirmButtonText: 'Update',
          },
        },
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.updateAlbumRequested({ album: MOCK_IMAGES[3].album }),
      );
    });

    it('should not dispatch action if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      component.hasUnsavedChanges = true;
      component.newImagesFormData = { [MOCK_IMAGES[3].id]: MOCK_IMAGES[3] };
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
