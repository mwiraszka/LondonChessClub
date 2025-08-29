import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { ImageViewerComponent } from '@app/components/image-viewer/image-viewer.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { DialogService } from '@app/services';
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

  let dialogOpenSpy: jest.SpyInstance;
  let onClickAlbumCoverSpy: jest.SpyInstance;
  let requestDeleteAlbumSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminControlsDirective, PhotoGridComponent, TooltipDirective],
      providers: [
        provideRouter([{ path: 'photo-gallery', component: PhotoGalleryStubComponent }]),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGridComponent);
    component = fixture.componentInstance;

    dialogService = TestBed.inject(DialogService);

    dialogOpenSpy = jest.spyOn(dialogService, 'open');
    onClickAlbumCoverSpy = jest.spyOn(component, 'onClickAlbumCover');
    requestDeleteAlbumSpy = jest.spyOn(component.requestDeleteAlbum, 'emit');

    component.isAdmin = true;
    component.photoImages = MOCK_IMAGES;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClickAlbumCover', () => {
    it('should open ImageViewerComponent dialog with correct data', async () => {
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
  });

  describe('onOpenImageExplorer', () => {
    it('should open ImageExplorerComponent dialog with correct data', async () => {
      await component.onOpenImageExplorer();

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: expect.any(Function),
        inputs: { selectable: false },
        isModal: true,
      });
    });
  });

  describe('getAdminControlsConfig', () => {
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

  describe('onRequestDeleteAlbum', () => {
    it('should emit request delete album event', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

      await component.onRequestDeleteAlbum(MOCK_IMAGES[1].album);

      const photoCount = MOCK_IMAGES.filter(
        image => image.album === MOCK_IMAGES[1].album,
      ).length;

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        isModal: true,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${MOCK_IMAGES[1].album} and its ${photoCount} photos?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
      });
      expect(requestDeleteAlbumSpy).toHaveBeenCalledWith(MOCK_IMAGES[1].album);
    });

    it('should not emit equest delete album event if dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      await component.onRequestDeleteAlbum(MOCK_IMAGES[1].album);

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(requestDeleteAlbumSpy).not.toHaveBeenCalled();
    });
  });

  describe('getAlbumPhotoCountText', () => {
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
    it('should call onClickAlbumCover when an album cover is clicked', () => {
      query(fixture.debugElement, '.album-cover').triggerEventHandler('click');

      expect(onClickAlbumCoverSpy).toHaveBeenCalledWith("John's Images");
    });

    it('should honour maxAlbums input property', () => {
      fixture.componentRef.setInput('maxAlbums', 3);
      fixture.detectChanges();

      expect(queryAll(fixture.debugElement, '.album-cover').length).toBe(3);
    });

    it('should display admin toolbar when isAdmin is true', () => {
      fixture.componentRef.setInput('isAdmin', true);
      fixture.detectChanges();

      expect(query(fixture.debugElement, 'lcc-admin-toolbar')).toBeTruthy();
    });

    it('should not display admin toolbar when isAdmin is false', () => {
      fixture.componentRef.setInput('isAdmin', false);
      fixture.detectChanges();

      expect(query(fixture.debugElement, 'lcc-admin-toolbar')).toBeFalsy();
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
