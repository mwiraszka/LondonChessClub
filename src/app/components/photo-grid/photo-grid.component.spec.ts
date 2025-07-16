import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ImageExplorerComponent } from '@app/components/image-explorer/image-explorer.component';
import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { DialogService } from '@app/services';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { customSort, query, queryAll, queryTextContent } from '@app/utils';

import { PhotoGridComponent } from './photo-grid.component';

@Component({
  template: '',
})
class PhotoGalleryStubComponent {}

describe('PhotoGridComponent', () => {
  let fixture: ComponentFixture<PhotoGridComponent>;
  let component: PhotoGridComponent;

  let dialogService: DialogService;
  let store: MockStore;

  let dialogOpenSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  let onClickAlbumCoverSpy: jest.SpyInstance;
  let onOpenImageExplorerSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminControlsDirective, PhotoGridComponent, TooltipDirective],
      providers: [
        provideMockStore(),
        provideRouter([{ path: 'photo-gallery', component: PhotoGalleryStubComponent }]),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PhotoGridComponent);
        component = fixture.componentInstance;
        dialogService = TestBed.inject(DialogService);

        store = TestBed.inject(MockStore);

        component.isAdmin = true;
        component.photoImages = MOCK_IMAGES;

        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        dispatchSpy = jest.spyOn(store, 'dispatch');
        onClickAlbumCoverSpy = jest.spyOn(component, 'onClickAlbumCover');
        onOpenImageExplorerSpy = jest.spyOn(component, 'onOpenImageExplorer');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    describe('when thumbnails were fetched less than 30 minutes ago', () => {
      beforeEach(() => {
        component.photoImages = [MOCK_IMAGES[1]];
        store.overrideSelector(
          ImagesSelectors.selectLastAlbumCoversFetch,
          new Date(Date.now() - 29 * 60 * 1000).toISOString(),
        );

        component.ngOnChanges({
          photoImages: {
            currentValue: [MOCK_IMAGES[1]],
            previousValue: [],
            firstChange: false,
            isFirstChange: () => false,
          },
        });
        fixture.detectChanges();
      });

      it('should not dispatch fetchBatchThumbnailsRequested', () => {
        expect(dispatchSpy).not.toHaveBeenCalledWith(
          ImagesActions.fetchBatchThumbnailsRequested({
            imageIds: MOCK_IMAGES.map(image => image.id),
            context: 'photos',
          }),
        );
      });
    });

    describe('when thumbnails were last fetched over 30 minutes ago', () => {
      beforeEach(() => {
        component.photoImages = [MOCK_IMAGES[0]];
        store.overrideSelector(
          ImagesSelectors.selectLastAlbumCoversFetch,
          new Date(Date.now() - 31 * 60 * 1000).toISOString(),
        );

        component.ngOnChanges({
          photoImages: {
            currentValue: [MOCK_IMAGES[0]],
            previousValue: [],
            firstChange: false,
            isFirstChange: () => false,
          },
        });
        fixture.detectChanges();
      });

      it('should dispatch fetchBatchThumbnailsRequested', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          ImagesActions.fetchBatchThumbnailsRequested({
            imageIds: [MOCK_IMAGES[0].id],
            context: 'photos',
          }),
        );
      });
    });

    it('should have albumCovers getter that filters images with albumCover', () => {
      const albumCovers = MOCK_IMAGES.filter(image => image.albumCover);

      expect(component.albumCovers.length).toBe(albumCovers.length);

      albumCovers.forEach((cover, index) => {
        expect(component.albumCovers[index].albumCover).toBe(cover.albumCover);
        expect(component.albumCovers[index].id).toBe(cover.id);
      });
    });

    it('should honour maxAlbums input property', () => {
      component.maxAlbums = 1;
      fixture.detectChanges();

      expect(queryAll(fixture.debugElement, '.album-cover').length).toBe(1);
    });
  });

  describe('album interactions', () => {
    it('should call onClickAlbumCover when an album cover is clicked', () => {
      query(fixture.debugElement, '.album-cover').triggerEventHandler('click');

      expect(onClickAlbumCoverSpy).toHaveBeenCalledWith("John's Images");
    });

    it('should open ImageViewerComponent dialog with filtered images when clicking album cover', async () => {
      const album = 'Album of Jane';
      const albumPhotos = MOCK_IMAGES.filter(image => image.album === album).sort(
        (a, b) => customSort(a, b, 'caption'),
      );

      await component.onClickAlbumCover(album);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: ImageViewerComponent,
        isModal: true,
        inputs: {
          album,
          images: albumPhotos,
          isAdmin: true,
        },
      });
    });

    it('should call onOpenImageExplorer when image explorer button is clicked', () => {
      query(fixture.debugElement, '.image-explorer-button').triggerEventHandler('click');

      expect(onOpenImageExplorerSpy).toHaveBeenCalledTimes(1);
    });

    it('should open ImageExplorerComponent dialog with selectable false when opening image explorer', async () => {
      await component.onOpenImageExplorer();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: ImageExplorerComponent,
        inputs: { selectable: false },
        isModal: true,
      });
    });
  });

  describe('admin controls', () => {
    it('should return correct admin controls config for albums', () => {
      const album = MOCK_IMAGES[0].album;
      const config = component.getAdminControlsConfig(album);

      expect(config.buttonSize).toBe(34);
      expect(config.editPath).toEqual(['album', 'edit', album]);
      expect(config.isEditDisabled).toBe(false);
      expect(config.isDeleteDisabled).toBe(false);
      expect(config.itemName).toBe(album);
    });
  });

  describe('album photo count', () => {
    it('should return correct singular photo count text', () => {
      expect(component.getAlbumPhotoCountText('Tournaments')).toBe('1 photo');
    });

    it('should return correct plural photo count text', () => {
      const albumName = 'Album of Jane';
      const expectedPhotoCount = MOCK_IMAGES.filter(
        image => image.album === albumName,
      ).length;

      expect(component.getAlbumPhotoCountText(albumName)).toBe(
        `${expectedPhotoCount} photos`,
      );
    });
  });

  describe('template rendering', () => {
    it('should display admin controls header when isAdmin is true', () => {
      component.isAdmin = true;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.admin-controls-header')).not.toBeNull();
    });

    it('should not display admin controls header when isAdmin is false', () => {
      component.isAdmin = false;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.admin-controls-header')).toBeNull();
    });

    it('should display album covers with correct information', () => {
      const albumCovers = queryAll(fixture.debugElement, '.album-cover');
      const expectedAlbumCovers = MOCK_IMAGES.filter(image => image.albumCover);

      expect(albumCovers.length).toBe(expectedAlbumCovers.length);

      albumCovers.forEach((albumCover, i) => {
        expect(queryTextContent(albumCover, '.album-name')).toBe(
          expectedAlbumCovers[i].album,
        );

        const expectedPhotoCountText = component
          .getAlbumPhotoCountText(expectedAlbumCovers[i].album)
          .toUpperCase();
        expect(queryTextContent(albumCover, '.photo-count')).toBe(expectedPhotoCountText);
      });
    });
  });
});
