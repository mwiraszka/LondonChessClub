import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { DialogService } from '@app/services';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { query, queryAll, queryTextContent } from '@app/utils';

import { ImageExplorerComponent } from './image-explorer.component';

describe('ImageExplorerComponent', () => {
  let fixture: ComponentFixture<ImageExplorerComponent>;
  let component: ImageExplorerComponent;

  let dialogService: DialogService;
  let store: MockStore;
  let changeDetectorRef: ChangeDetectorRef;

  let dialogOpenSpy: jest.SpyInstance;
  let dialogResultSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;

  const mockImages = MOCK_IMAGES;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminControlsDirective, ImageExplorerComponent],
      providers: [
        provideMockStore(),
        { provide: DialogService, useValue: { open: jest.fn() } },
        { provide: ActivatedRoute, useValue: { paramMap: [] } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ImageExplorerComponent);
        component = fixture.componentInstance;

        dialogService = TestBed.inject(DialogService);
        store = TestBed.inject(MockStore);
        changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);

        store.overrideSelector(ImagesSelectors.selectAllImages, mockImages);
        store.overrideSelector(ImagesSelectors.selectFilteredCount, mockImages.length);
        store.overrideSelector(ImagesSelectors.selectTotalCount, mockImages.length);
        store.overrideSelector(ImagesSelectors.selectOptions, {
          page: 1,
          pageSize: 20,
          sortBy: 'modificationInfo' as keyof (typeof mockImages)[0],
          sortOrder: 'desc',
          filters: {},
          search: '',
        });
        store.overrideSelector(ImagesSelectors.selectLastThumbnailsFetch, null);

        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');
        dispatchSpy = jest.spyOn(store, 'dispatch');
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should be selectable by default', () => {
      fixture.detectChanges();
      expect(component.selectable).toBe(true);
    });

    describe('when images were fetched less than 10 minutes ago', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        store.overrideSelector(
          ImagesSelectors.selectLastThumbnailsFetch,
          new Date(Date.now() - 9 * 60 * 1000).toISOString(),
        );
        store.refreshState();
        fixture.detectChanges();
      });

      it('should not dispatch fetchThumbnailsRequested', () => {
        expect(dispatchSpy).not.toHaveBeenCalledWith(
          ImagesActions.fetchThumbnailsRequested(),
        );
      });
    });

    describe('when images were last fetched over 10 minutes ago', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        store.overrideSelector(
          ImagesSelectors.selectLastThumbnailsFetch,
          new Date(Date.now() - 11 * 60 * 1000).toISOString(),
        );
        store.refreshState();
        fixture.detectChanges();
      });

      it('should dispatch fetchThumbnailsRequested', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          ImagesActions.fetchThumbnailsRequested(),
        );
      });
    });
  });

  describe('admin controls', () => {
    it('should return correct admin controls config', () => {
      const config = component.getAdminControlsConfig(mockImages[0]);

      expect(config.buttonSize).toBe(34);
      expect(config.editPath).toEqual(['image', 'edit', mockImages[0].id.split('-')[0]]);
      expect(config.editInNewTab).toBe(true);
      expect(config.isDeleteDisabled).toBe(false); // mockImages[0] has no article appearances
      expect(config.deleteDisabledReason).toBe(
        'Image cannot be delete while it is used in an article',
      );
      expect(config.itemName).toBe(mockImages[0].filename);
    });

    it('should disable delete for images used in articles', () => {
      // Modify a mock image to have article appearances
      const imageWithArticles = { ...mockImages[0], articleAppearances: 2 };
      const config = component.getAdminControlsConfig(imageWithArticles);

      expect(config.isDeleteDisabled).toBe(true);
    });
  });

  describe('image deletion', () => {
    it('should open confirmation dialog and dispatch delete action when confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

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
      expect(dispatchSpy).toHaveBeenCalledWith(
        ImagesActions.deleteImageRequested({ image: mockImages[1] }),
      );
      expect(dialogResultSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch delete action when dialog is cancelled', async () => {
      // Reset all mocks before this test
      jest.clearAllMocks();
      dialogOpenSpy.mockResolvedValue('cancel');

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
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(dialogResultSpy).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      // Set up mock data and re-render component
      store.overrideSelector(ImagesSelectors.selectAllImages, mockImages);
      fixture.detectChanges();
    });

    it('should render images from the store', () => {
      expect(queryAll(fixture.debugElement, '.image-card-container').length).toBe(
        mockImages.length,
      );
    });

    it('should apply selectable class when selectable is true', () => {
      component.selectable = true;
      fixture.detectChanges();

      expect(
        query(fixture.debugElement, '.image-card-container').classes['selectable'],
      ).toBe(true);
    });

    it('should not apply selectable class when selectable is false', () => {
      component.selectable = false;
      changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(
        query(fixture.debugElement, '.image-card-container').classes['selectable'],
      ).toBe(undefined);
    });

    it('should emit dialogResult with image id when clicked and selectable is true', () => {
      component.selectable = true;
      fixture.detectChanges();

      query(fixture.debugElement, '.image-card-container').triggerEventHandler('click');

      expect(dialogResultSpy).toHaveBeenCalledWith(mockImages[0].id);
    });

    it('should not emit dialogResult when clicked and selectable is false', () => {
      component.selectable = false;
      fixture.detectChanges();

      query(fixture.debugElement, '.image-card-container').triggerEventHandler('click');

      expect(dialogResultSpy).not.toHaveBeenCalled();
    });

    it('should display image metadata', () => {
      expect(queryTextContent(fixture.debugElement, '.caption span')).toBe(
        mockImages[0].caption,
      );
      expect(queryTextContent(fixture.debugElement, '.filename span')).toBe(
        mockImages[0].filename,
      );

      // Actual text will depend on formatDate pipe implementation
      expect(query(fixture.debugElement, '.upload-date span')).toBeTruthy();
    });
  });
});
