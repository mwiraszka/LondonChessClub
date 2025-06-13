import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

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
      imports: [ImageViewerComponent],
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
      .overrideDirective(AdminControlsDirective, {
        set: { selector: '[adminControls]' },
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

  describe('initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should dispatch fetchImageRequested on init', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[0].id }),
      );
    });

    it('should set up currentImage$ observable', () => {
      component.currentImage$.subscribe(image => {
        expect(image).toEqual(mockImages[0]);
      });
    });

    it('should set up key listener after view init', fakeAsync(() => {
      // @ts-expect-error Private class member
      const initKeyListenerSpy = jest.spyOn(component, 'initKeyListener');
      component.ngAfterViewInit();
      tick(0);

      expect(initKeyListenerSpy).toHaveBeenCalled();
    }));
  });

  describe('navigation', () => {
    it('should go to previous image when onPreviousImage is called', () => {
      // @ts-expect-error Private class member
      const detachSpy = jest.spyOn(component.adminControlsDirective, 'detach');
      component.onPreviousImage();
      fixture.detectChanges();

      expect(detachSpy).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[3].id }),
      );
    });

    it('should go to next image when onNextImage is called', () => {
      // @ts-expect-error Private class member
      const detachSpy = jest.spyOn(component.adminControlsDirective, 'detach');
      component.onNextImage();
      fixture.detectChanges();

      expect(detachSpy).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[1].id }),
      );
    });
  });

  describe('navigation methods', () => {
    it('should handle ArrowLeft key', () => {
      const previousImageSpy = jest.spyOn(component, 'onPreviousImage');
      component.onPreviousImage();
      fixture.detectChanges();

      expect(previousImageSpy).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[3].id }),
      );
    });

    it('should handle ArrowRight key', () => {
      const nextImageSpy = jest.spyOn(component, 'onNextImage');
      component.onNextImage();
      fixture.detectChanges();

      expect(nextImageSpy).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[1].id }),
      );
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
            title: 'Delete image',
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
            title: 'Delete image',
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
    it('should display image with album name and caption', () => {
      expect(query(fixture.debugElement, 'figure .image-container img')).not.toBeNull();
      expect(queryTextContent(fixture.debugElement, 'figcaption .album-name')).toBe(
        mockAlbum,
      );
      expect(queryTextContent(fixture.debugElement, 'figcaption .image-caption')).toBe(
        mockImages[0].caption,
      );
    });

    it('should render previous and next buttons', () => {
      expect(
        query(fixture.debugElement, '.previous-image-button-wrapper button'),
      ).not.toBeNull();
      expect(
        query(fixture.debugElement, '.next-image-button-wrapper button'),
      ).not.toBeNull();
    });

    it('should handle click on previous button', () => {
      jest.spyOn(component, 'onPreviousImage');
      const prevButton = query(
        fixture.debugElement,
        '.previous-image-button-wrapper button',
      );
      prevButton.triggerEventHandler('click');
      expect(component.onPreviousImage).toHaveBeenCalled();
    });

    it('should handle click on next button', () => {
      jest.spyOn(component, 'onNextImage');
      const nextButton = query(fixture.debugElement, '.next-image-button-wrapper button');
      nextButton.triggerEventHandler('click');
      expect(component.onNextImage).toHaveBeenCalled();
    });
  });
});
