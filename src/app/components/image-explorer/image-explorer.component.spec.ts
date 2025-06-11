import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { DialogService } from '@app/services';
import { ImagesActions, ImagesSelectors } from '@app/store/images';

import { BasicDialogComponent } from '../basic-dialog/basic-dialog.component';
import { ImageExplorerComponent } from './image-explorer.component';

describe('ImageExplorerComponent', () => {
  let fixture: ComponentFixture<ImageExplorerComponent>;
  let component: ImageExplorerComponent;
  let store: MockStore;
  let dialogService: DialogService;

  const mockImages = MOCK_IMAGES;

  beforeEach(async () => {
    const mockDialogService = {
      open: jest.fn().mockResolvedValue('confirm'),
    };

    await TestBed.configureTestingModule({
      imports: [ImageExplorerComponent],
      providers: [
        provideMockStore(),
        { provide: DialogService, useValue: mockDialogService },
      ],
    })
      .overrideDirective(AdminControlsDirective, {
        set: { selector: '[adminControls]' },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ImageExplorerComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        dialogService = TestBed.inject(DialogService);

        store.overrideSelector(ImagesSelectors.selectAllImages, mockImages);
        jest.spyOn(store, 'dispatch');

        fixture.detectChanges();
      });
  });

  describe('initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should dispatch fetchImageThumbnailsRequested on init', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        ImagesActions.fetchImageThumbnailsRequested(),
      );
    });

    it('should have selectable input set to true by default', () => {
      expect(component.selectable).toBe(true);
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
      expect(dialogResultSpy).not.toHaveBeenCalled();
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
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(dialogResultSpy).not.toHaveBeenCalled();
    });
  });

  describe('UI elements', () => {
    beforeEach(() => {
      // Set up mock data and rerender component
      store.overrideSelector(ImagesSelectors.selectAllImages, mockImages);
      fixture.detectChanges();
    });

    it('should render images from the store', () => {
      expect(elements('.image-card-container').length).toBe(mockImages.length);
    });

    it('should apply selectable class when selectable is true', () => {
      component.selectable = true;
      fixture.detectChanges();

      expect(element('.image-card-container').classes['selectable']).toBe(true);
    });

    it('should not apply selectable class when selectable is false', () => {
      component.selectable = false;
      fixture.detectChanges();

      expect(element('.image-card-container').classes['selectable']).toBe(undefined);
    });

    it('should emit dialogResult with image id when clicked and selectable is true', () => {
      const dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');
      component.selectable = true;
      fixture.detectChanges();

      element('.image-card-container').triggerEventHandler('click');

      expect(dialogResultSpy).toHaveBeenCalledWith(mockImages[0].id);
    });

    it('should not emit dialogResult when clicked and selectable is false', () => {
      const dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');
      component.selectable = false;
      fixture.detectChanges();

      element('.image-card-container').triggerEventHandler('click');

      expect(dialogResultSpy).not.toHaveBeenCalled();
    });

    it('should display image metadata', () => {
      expect(elementTextContent('.caption span')).toBe(mockImages[0].caption);
      expect(elementTextContent('.filename span')).toBe(mockImages[0].filename);

      // Actual text will depend on formatDate pipe implementation
      expect(element('.upload-date span')).not.toBeNull();
    });
  });

  function elements(selector: string, rootElement?: DebugElement): DebugElement[] {
    return (rootElement ?? fixture.debugElement).queryAll(By.css(selector));
  }

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  function elementTextContent(selector: string): string {
    return element(selector).nativeElement.textContent.trim();
  }
});
