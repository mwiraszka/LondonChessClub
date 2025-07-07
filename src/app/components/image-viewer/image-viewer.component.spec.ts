import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { DialogService } from '@app/services';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { query, queryTextContent } from '@app/utils';

import { ImageViewerComponent } from './image-viewer.component';

describe('ImageViewerComponent', () => {
  let fixture: ComponentFixture<ImageViewerComponent>;
  let component: ImageViewerComponent;
  let store: MockStore;
  let dialogService: DialogService;

  const mockAlbum = 'Test Album';
  const mockImages = MOCK_IMAGES;
  const mockIsAdmin = true;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminControlsDirective, ImageViewerComponent],
      providers: [
        provideMockStore(),
        { provide: DialogService, useValue: { open: jest.fn() } },
        {
          provide: Renderer2,
          useValue: {
            listen: jest.fn().mockReturnValue(() => {}),
          },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ImageViewerComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        dialogService = TestBed.inject(DialogService);

        component.album = mockAlbum;
        component.images = mockImages;
        component.isAdmin = mockIsAdmin;

        store.overrideSelector(ImagesSelectors.selectAllImages, mockImages);
        store.overrideSelector(
          ImagesSelectors.selectImageById(mockImages[0].id),
          mockImages[0],
        );

        jest.spyOn(store, 'dispatch');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should dispatch fetchImageRequested for image at index 0', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[0].id }),
      );
    });

    it('should set up currentImage$ observable', () => {
      component.currentImage$.subscribe(image => {
        expect(image).toEqual(mockImages[0]);
      });
    });

    describe('prefetching adjacent images', () => {
      let fetchImageSpy: jest.SpyInstance;

      beforeEach(() => {
        jest.useFakeTimers();
        // @ts-expect-error Private class member
        fetchImageSpy = jest.spyOn(component, 'fetchImage');
      });

      it('should correctly handle albums with a single image', () => {
        component.images = [mockImages[0]];

        // @ts-expect-error Private class member
        component.prefetchAdjacentImages();

        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).not.toHaveBeenCalled();
      });

      it('should correctly handle albums with two images', () => {
        component.images = [mockImages[0], mockImages[1]];

        // @ts-expect-error Private class member
        component.prefetchAdjacentImages();

        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(1);

        jest.clearAllMocks();
        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).not.toHaveBeenCalled();
      });

      it('should correctly handle albums with three images', () => {
        component.images = [mockImages[0], mockImages[1], mockImages[2]];

        // @ts-expect-error Private class member
        component.prefetchAdjacentImages();

        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(1);

        jest.clearAllMocks();
        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(2);

        jest.clearAllMocks();
        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).not.toHaveBeenCalled();
      });

      it('should correctly handle albums with many images', () => {
        // @ts-expect-error Private class member
        component.prefetchAdjacentImages();

        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(1);

        jest.clearAllMocks();
        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(mockImages.length - 1);

        // Current image, immediate next image and immediate previous image have already been fetched
        const remainingImages = mockImages.length - 3;

        jest.clearAllMocks();
        jest.advanceTimersByTime(remainingImages * 1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(remainingImages);

        expect(fetchImageSpy).toHaveBeenNthCalledWith(1, 2);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(2, mockImages.length - 2);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(3, 3);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(4, mockImages.length - 3);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(5, 4);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(6, mockImages.length - 4);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(7, 5);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(8, mockImages.length - 5);
      });
    });
  });

  describe('navigation', () => {
    let adminControlsDetachSpy: jest.SpyInstance;
    let indexSubjectNextSpy: jest.SpyInstance;

    beforeEach(() => {
      // @ts-expect-error Private class member
      adminControlsDetachSpy = jest.spyOn(component.adminControlsDirective, 'detach');
      // @ts-expect-error Private class member
      indexSubjectNextSpy = jest.spyOn(component.indexSubject, 'next');

      // @ts-expect-error Private class member
      component.indexSubject.next(0);
      jest.clearAllMocks();
    });

    it('should go to previous image and detach admin controls when onPreviousImage is called', () => {
      component.onPreviousImage();
      fixture.detectChanges();

      expect(adminControlsDetachSpy).toHaveBeenCalledTimes(1);
      expect(indexSubjectNextSpy).toHaveBeenCalledTimes(1);
      expect(indexSubjectNextSpy).toHaveBeenCalledWith(mockImages.length - 1);
    });

    it('should go to next image and detach admin controls when onNextImage is called', () => {
      component.onNextImage();
      fixture.detectChanges();

      expect(adminControlsDetachSpy).toHaveBeenCalledTimes(1);
      expect(indexSubjectNextSpy).toHaveBeenCalledTimes(1);
      expect(indexSubjectNextSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('admin controls', () => {
    it('should return correct admin controls config', () => {
      const config = component.getAdminControlsConfig(mockImages[0]);

      expect(config.buttonSize).toBe(34);
      expect(config.editPath).toEqual(['image', 'edit', mockImages[0].id]);
      expect(config.editInNewTab).toBe(true);
      expect(config.isDeleteDisabled).toBe(false); // mockImages[0] has no article appearances
      expect(config.deleteDisabledReason).toBe(
        'Image cannot be deleted while it is used in an article',
      );
      expect(config.itemName).toBe(mockImages[0].filename);
    });
  });

  describe('image deletion', () => {
    it('should open confirmation dialog and dispatch delete action when confirmed', async () => {
      const dialogOpenSpy = jest
        .spyOn(dialogService, 'open')
        .mockResolvedValue('confirm');
      const dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');

      await component.onDeleteImage(mockImages[1]);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${mockImages[1].filename}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
      expect(dialogResultSpy).toHaveBeenCalledWith(null);
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.deleteImageRequested({ image: mockImages[1] }),
      );
    });

    it('should not dispatch delete action when dialog is cancelled', async () => {
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockResolvedValue('cancel');
      const dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');

      await component.onDeleteImage(mockImages[1]);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${mockImages[1].filename}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
      expect(dialogResultSpy).not.toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalledWith(
        ImagesActions.deleteImageRequested({ image: mockImages[1] }),
      );
    });
  });

  describe('UI elements', () => {
    it('should display image with album name and caption after image load', () => {
      query(fixture.debugElement, '.image-container img').triggerEventHandler('load');
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.album-name')).toBe(mockAlbum);
      expect(queryTextContent(fixture.debugElement, '.image-caption')).toBe(
        mockImages[0].caption,
      );
    });

    it('should display enabled previous and next buttons if album contains more than one image', () => {
      expect(
        query(fixture.debugElement, '.previous-image-button').nativeElement.disabled,
      ).toBe(false);
      expect(
        query(fixture.debugElement, '.next-image-button').nativeElement.disabled,
      ).toBe(false);
    });

    it('should display disabled previous and next buttons if album contains exactly one image', () => {
      component.images = [mockImages[0]];
      fixture.detectChanges();

      expect(
        query(fixture.debugElement, '.previous-image-button').nativeElement.disabled,
      ).toBe(true);
      expect(
        query(fixture.debugElement, '.next-image-button').nativeElement.disabled,
      ).toBe(true);
    });
  });
});
