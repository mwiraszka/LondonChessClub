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
import { ImagesActions } from '@app/store/images';
import { customSort, query, queryAll, queryTextContent } from '@app/utils';

import { PhotoGridComponent } from './photo-grid.component';

@Component({
  standalone: true,
  template: '',
})
class PhotoGalleryStubComponent {}

describe('PhotoGridComponent', () => {
  let fixture: ComponentFixture<PhotoGridComponent>;
  let component: PhotoGridComponent;
  let store: MockStore;
  let dialogService: DialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        store = TestBed.inject(MockStore);
        dialogService = TestBed.inject(DialogService);

        component.isAdmin = true;
        component.photoImages = MOCK_IMAGES;

        jest.spyOn(store, 'dispatch');

        fixture.detectChanges();
      });
  });

  describe('initialization', () => {
    it('should dispatch fetchImageThumbnailsRequested on init', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageThumbnailsRequested(),
      );
    });

    it('should have albumCovers getter that filters images with coverForAlbum', () => {
      const albumCovers = MOCK_IMAGES.filter(image => !!image.coverForAlbum);

      expect(component.albumCovers.length).toBe(albumCovers.length);

      albumCovers.forEach((cover, index) => {
        expect(component.albumCovers[index].coverForAlbum).toBe(cover.coverForAlbum);
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
      jest.spyOn(component, 'onClickAlbumCover');

      query(fixture.debugElement, '.album-cover').triggerEventHandler('click');

      expect(component.onClickAlbumCover).toHaveBeenCalledWith("John's Images");
    });

    it('should open ImageViewerComponent dialog with filtered images when clicking album cover', async () => {
      const dialogOpenSpy = jest.spyOn(dialogService, 'open');
      const album = 'Album of Jane';
      const albumPhotos = MOCK_IMAGES.filter(image => image.albums.includes(album)).sort(
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
      jest.spyOn(component, 'onOpenImageExplorer');

      query(fixture.debugElement, '.image-explorer-button').triggerEventHandler('click');

      expect(component.onOpenImageExplorer).toHaveBeenCalledTimes(1);
    });

    it('should open ImageExplorerComponent dialog with selectable false when opening image explorer', async () => {
      const dialogOpenSpy = jest.spyOn(dialogService, 'open');

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
      const albumName = 'Album 1';
      const config = component.getAdminControlsConfig(albumName);

      expect(config.buttonSize).toBe(34);
      expect(config.editPath).toEqual(['images', 'edit', albumName]);
      expect(config.isEditDisabled).toBe(true);
      expect(config.isDeleteDisabled).toBe(true);
      expect(config.editDisabledReason).toBe('Album controls currently unavailable');
      expect(config.deleteDisabledReason).toBe('Album controls currently unavailable');
      expect(config.itemName).toBe(albumName);
    });
  });

  describe('album photo count', () => {
    it('should return correct singular photo count string', () => {
      expect(component.getAlbumPhotoCount('Single Photo Album')).toBe('1 PHOTO');
    });

    it('should return correct plural photo count string', () => {
      const albumName = 'Album of Jane';
      const expectedPhotoCount = MOCK_IMAGES.filter(image =>
        image.albums.includes(albumName),
      ).length;

      expect(component.getAlbumPhotoCount(albumName)).toBe(
        `${expectedPhotoCount} PHOTOS`,
      );
    });
  });

  describe('UI elements', () => {
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
      const expectedAlbumCovers = MOCK_IMAGES.filter(image => !!image.coverForAlbum);

      expect(albumCovers.length).toBe(expectedAlbumCovers.length);

      albumCovers.forEach((albumCover, i) => {
        expect(queryTextContent(albumCover, '.album-name')).toBe(
          expectedAlbumCovers[i].coverForAlbum,
        );

        const expectedPhotoCount = component.getAlbumPhotoCount(
          expectedAlbumCovers[i].coverForAlbum,
        );
        expect(queryTextContent(albumCover, '.photo-count')).toBe(expectedPhotoCount);
      });
    });
  });
});
