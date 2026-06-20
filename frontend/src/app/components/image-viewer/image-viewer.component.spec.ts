import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

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

  let dialogService: DialogService;
  let store: MockStore;

  let adminControlsDetachSpy: jest.SpyInstance;
  let dialogOpenSpy: jest.SpyInstance;
  let dialogResultSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  let fetchImageSpy: jest.SpyInstance;
  let indexSubjectNextSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminControlsDirective, ImageViewerComponent],
      providers: [
        provideMockStore(),
        {
          provide: DialogService,
          useValue: { open: jest.fn() },
        },
        {
          provide: Renderer2,
          useValue: {
            listen: jest.fn().mockReturnValue(() => {}),
          },
        },
      ],
    }).compileComponents();

    dialogService = TestBed.inject(DialogService);
    store = TestBed.inject(MockStore);

    store.overrideSelector(ImagesSelectors.selectAllImages, MOCK_IMAGES);
    MOCK_IMAGES.forEach(image => {
      store.overrideSelector(ImagesSelectors.selectImageById(image.id), image);
    });

    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;

    // Spies must be set up before first detectChanges where ngOnInit runs
    dialogOpenSpy = jest.spyOn(dialogService, 'open');
    dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');
    dispatchSpy = jest.spyOn(store, 'dispatch');
    // @ts-expect-error Private class member
    fetchImageSpy = jest.spyOn(component, 'fetchImage');
    // @ts-expect-error Private class member
    indexSubjectNextSpy = jest.spyOn(component.indexSubject, 'next');

    component.album = 'Mock Album';
    component.images = MOCK_IMAGES;
    component.isAdmin = true;
    fixture.detectChanges();

    // ViewChild available after first change detection
    // @ts-expect-error Private class member
    adminControlsDetachSpy = jest.spyOn(component.adminControlsDirective, 'detach');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should dispatch fetchMainImageRequested for image at index 0', () => {
      // Manually trigger image fetch to avoid timing issues with async pipe subscription
      // @ts-expect-error Private class member
      component.fetchImage(0);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ImagesActions.fetchMainImageRequested({
          imageId: MOCK_IMAGES[0].id,
        }),
      );
    });

    it('should set up currentImage$ observable', () => {
      component.currentImage$.subscribe(image => {
        expect(image).toEqual(MOCK_IMAGES[0]);
      });
    });

    describe('prefetching adjacent images', () => {
      beforeEach(() => jest.useFakeTimers());
      afterEach(() => jest.useRealTimers());

      it('should correctly handle albums with a single image', () => {
        jest.clearAllMocks();
        component.images = [MOCK_IMAGES[0]];

        // @ts-expect-error Private class member
        component.prefetchAdjacentImages();

        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).not.toHaveBeenCalled();
      });

      it('should correctly handle albums with two images', () => {
        jest.clearAllMocks();
        component.images = [MOCK_IMAGES[0], MOCK_IMAGES[1]];

        // @ts-expect-error Private class member
        component.prefetchAdjacentImages();

        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(1, true);

        jest.clearAllMocks();
        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).not.toHaveBeenCalled();
      });

      it('should correctly handle albums with three images', () => {
        jest.clearAllMocks();
        component.images = [MOCK_IMAGES[0], MOCK_IMAGES[1], MOCK_IMAGES[2]];

        // @ts-expect-error Private class member
        component.prefetchAdjacentImages();

        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(1, true);

        jest.clearAllMocks();
        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(2, true);

        jest.clearAllMocks();
        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).not.toHaveBeenCalled();
      });

      it('should correctly handle albums with many images', () => {
        jest.clearAllMocks();

        // @ts-expect-error Private class member
        component.prefetchAdjacentImages();

        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(1, true);

        jest.clearAllMocks();
        jest.advanceTimersByTime(1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(1);
        expect(fetchImageSpy).toHaveBeenCalledWith(MOCK_IMAGES.length - 1, true);

        // Current image, immediate next image and immediate previous image have already been fetched
        const remainingImages = MOCK_IMAGES.length - 3;

        jest.clearAllMocks();
        jest.advanceTimersByTime(remainingImages * 1000);

        expect(fetchImageSpy).toHaveBeenCalledTimes(remainingImages);

        expect(fetchImageSpy).toHaveBeenNthCalledWith(1, 2, true);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(2, MOCK_IMAGES.length - 2, true);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(3, 3, true);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(4, MOCK_IMAGES.length - 3, true);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(5, 4, true);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(6, MOCK_IMAGES.length - 4, true);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(7, 5, true);
        expect(fetchImageSpy).toHaveBeenNthCalledWith(8, MOCK_IMAGES.length - 5, true);
      });
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      // @ts-expect-error Private class member
      component.indexSubject.next(0);
      jest.clearAllMocks();
    });

    it('should go to previous image and detach admin controls when onPreviousImage is called', () => {
      component.onPreviousImage();
      fixture.detectChanges();

      expect(adminControlsDetachSpy).toHaveBeenCalledTimes(1);
      expect(indexSubjectNextSpy).toHaveBeenCalledTimes(1);
      expect(indexSubjectNextSpy).toHaveBeenCalledWith(MOCK_IMAGES.length - 1);
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
      const config = component.getAdminControlsConfig(MOCK_IMAGES[0]);

      expect(config.buttonSize).toBe(34);
      expect(config.editPath).toEqual(['image', 'edit', MOCK_IMAGES[0].id]);
      expect(config.editInNewTab).toBe(true);
      expect(config.isDeleteDisabled).toBe(false); // MOCK_IMAGES[0] has no article appearances
      expect(config.deleteDisabledReason).toBe(
        'Image cannot be deleted while it is used in an article',
      );
      expect(config.itemName).toBe(MOCK_IMAGES[0].filename);
    });
  });

  describe('image deletion', () => {
    it('should open confirmation dialog and dispatch delete action when confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

      await component.onDeleteImage(MOCK_IMAGES[1]);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${MOCK_IMAGES[1].filename}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
      expect(dialogResultSpy).toHaveBeenCalledWith(null);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ImagesActions.deleteImageRequested({ image: MOCK_IMAGES[1] }),
      );
    });

    it('should not dispatch delete action when dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      await component.onDeleteImage(MOCK_IMAGES[1]);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${MOCK_IMAGES[1].filename}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
      expect(dialogResultSpy).not.toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        ImagesActions.deleteImageRequested({ image: MOCK_IMAGES[1] }),
      );
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('album', MOCK_IMAGES[0].album);
      component.currentImage$ = of(MOCK_IMAGES[0]);
      fixture.detectChanges();
    });

    it('should display image with album name and caption after image load', () => {
      query(fixture.debugElement, '.image-container img').triggerEventHandler('load');
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.album-name')).toBe(
        MOCK_IMAGES[0].album,
      );
      expect(queryTextContent(fixture.debugElement, '.image-caption')).toBe(
        MOCK_IMAGES[0].caption,
      );
    });

    it('should display enabled previous and next buttons if album contains more than one image', () => {
      fixture.componentRef.setInput('images', MOCK_IMAGES);
      fixture.detectChanges();

      expect(
        query(fixture.debugElement, '.previous-image-button').nativeElement.disabled,
      ).toBe(false);
      expect(
        query(fixture.debugElement, '.next-image-button').nativeElement.disabled,
      ).toBe(false);
    });

    it('should display disabled previous and next buttons if album contains exactly one image', () => {
      fixture.componentRef.setInput('images', [MOCK_IMAGES[0]]);
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
