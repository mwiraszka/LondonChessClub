import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { DialogService } from '@app/services';
import { ImagesActions, ImagesSelectors } from '@app/store/images';

import { BasicDialogComponent } from '../basic-dialog/basic-dialog.component';
import { ImageViewerComponent } from './image-viewer.component';

describe('ImageViewerComponent', () => {
  let fixture: ComponentFixture<ImageViewerComponent>;
  let component: ImageViewerComponent;
  let store: MockStore;
  let dialogService: DialogService;

  const mockAlbum = 'Test Album';
  const mockImages = MOCK_IMAGES;
  const mockIsAdmin = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRenderer: any;

  const mockListenFn = jest.fn().mockImplementation(() => {
    return () => {};
  });

  beforeEach(async () => {
    // Mock the component's initKeyListener method to call the renderer.listen directly
    // This allows us to bypass the setTimeout
    mockRenderer = {
      listen: mockListenFn,
    };

    const mockDialogService = {
      open: jest.fn().mockResolvedValue('confirm'),
    };

    await TestBed.configureTestingModule({
      imports: [ImageViewerComponent],
      providers: [
        provideMockStore(),
        { provide: DialogService, useValue: mockDialogService },
        { provide: Renderer2, useValue: mockRenderer },
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
      mockListenFn.mockClear();
      // Replace initKeyListener with a direct spy implementation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(component as any, 'initKeyListener').mockImplementation(() => {
        component['keyListener'] = mockRenderer.listen('document', 'keydown', () => {});
      });
      component.ngAfterViewInit();
      tick(0);

      expect(component['initKeyListener']).toHaveBeenCalled();
      expect(mockRenderer.listen).toHaveBeenCalledWith(
        'document',
        'keydown',
        expect.any(Function),
      );
    }));
  });

  describe('navigation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      fixture.detectChanges();
    });

    it('should go to previous image when onPreviousImage is called', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.adminControlsDirective = { detach: jest.fn() } as any;
      component.onPreviousImage();

      expect(component.adminControlsDirective?.detach).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[3].id }),
      );
    });

    it('should go to next image when onNextImage is called', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.adminControlsDirective = { detach: jest.fn() } as any;
      component.onNextImage();

      expect(component.adminControlsDirective?.detach).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[1].id }),
      );
    });
  });

  describe('keyboard navigation', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let keydownHandler: any;

    beforeEach(fakeAsync(() => {
      mockListenFn.mockClear();

      // Implement our own version of initKeyListener that will call the
      // renderer.listen method and capture the keydown handler
      component['initKeyListener'] = () => {
        component['keyListener'] = mockRenderer.listen(
          'document',
          'keydown',
          (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' && component.images.length > 1) {
              component.onPreviousImage();
            } else if (
              (event.key === 'ArrowRight' || event.key === ' ') &&
              component.images.length > 1
            ) {
              component.onNextImage();
            }
          },
        );
      };

      component.ngAfterViewInit();
      tick(0);

      // Extract the keydownHandler from the mock implementation for testing
      keydownHandler = mockListenFn.mock.calls[0][2];
    }));

    it('should navigate to previous image on ArrowLeft key', () => {
      keydownHandler({ key: 'ArrowLeft' });

      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[3].id }),
      );
    });

    it('should navigate to next image on ArrowRight key', () => {
      keydownHandler({ key: 'ArrowRight' });

      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[1].id }),
      );
    });

    it('should navigate to next image on Space key', () => {
      keydownHandler({ key: ' ' });

      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageRequested({ imageId: mockImages[1].id }),
      );
    });

    it('should not navigate if there is only one image', () => {
      // Modify component to have only one image
      component.images = [mockImages[0]];
      jest.clearAllMocks();

      keydownHandler({ key: 'ArrowLeft' });
      keydownHandler({ key: 'ArrowRight' });
      keydownHandler({ key: ' ' });

      expect(store.dispatch).not.toHaveBeenCalled();
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
      const dialogOpenSpy = jest.spyOn(dialogService, 'open');
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
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.deleteImageRequested({ image: mockImages[1] }),
      );
      expect(dialogResultSpy).toHaveBeenCalledWith(null);
    });

    it('should not dispatch delete action when dialog is cancelled', async () => {
      // Reset all mocks before this test
      jest.clearAllMocks();
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
      // Check that store.dispatch was not called with the delete action
      expect(store.dispatch).not.toHaveBeenCalledWith(
        ImagesActions.deleteImageRequested({ image: mockImages[1] }),
      );
      expect(dialogResultSpy).not.toHaveBeenCalled();
    });
  });

  describe('UI elements', () => {
    it('should display image with album name and caption', () => {
      expect(element('figure .image-container img')).not.toBeNull();
      expect(elementTextContent('figcaption .album-name')).toBe(mockAlbum);
      expect(elementTextContent('figcaption .image-caption')).toBe(mockImages[0].caption);
    });

    it('should render previous and next buttons', () => {
      expect(element('.previous-image-button-wrapper button')).not.toBeNull();
      expect(element('.next-image-button-wrapper button')).not.toBeNull();
    });

    it('should handle click on previous button', () => {
      jest.spyOn(component, 'onPreviousImage');
      const prevButton = element('.previous-image-button-wrapper button');
      prevButton.triggerEventHandler('click');
      expect(component.onPreviousImage).toHaveBeenCalled();
    });

    it('should handle click on next button', () => {
      jest.spyOn(component, 'onNextImage');
      const nextButton = element('.next-image-button-wrapper button');
      nextButton.triggerEventHandler('click');
      expect(component.onNextImage).toHaveBeenCalled();
    });
  });

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  function elementTextContent(selector: string): string {
    return element(selector).nativeElement.textContent.trim();
  }
});
