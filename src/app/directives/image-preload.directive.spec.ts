import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Image } from '@app/models';

import { ImagePreloadDirective } from './image-preload.directive';

const MOCK_MAIN_URL = 'https://example.com/image.jpg';

@Component({
  template: '<img [image]="imageData" />',
  imports: [ImagePreloadDirective],
})
class TestComponent {
  imageData: Partial<Image> | null = {
    mainUrl: MOCK_MAIN_URL,
    caption: 'Test Image',
  };
}

describe('ImagePreloadDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  let imgElement: DebugElement;
  let directive: ImagePreloadDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    imgElement = fixture.debugElement.query(By.directive(ImagePreloadDirective));
    directive = imgElement.injector.get(ImagePreloadDirective);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set currentSrc from mainUrl', () => {
      expect(directive.currentSrc).toBe(MOCK_MAIN_URL);
    });

    it('should set currentSrc to fallback when image is null', () => {
      component.imageData = null;
      fixture.detectChanges();

      directive.ngOnInit();

      expect(directive.currentSrc).toBe('assets/fallback-image.png');
    });
  });

  describe('ngOnChanges', () => {
    it('should update image when image input changes', () => {
      // @ts-expect-error Protected class member
      const updateImageSpy = jest.spyOn(directive, 'updateImage');

      component.imageData = {
        mainUrl: 'https://example.com/new-image.jpg',
        caption: 'New Image',
      };
      fixture.detectChanges();

      expect(updateImageSpy).toHaveBeenCalled();
    });
  });

  describe('updateImage', () => {
    it('should set aspect ratio when dimensions are provided', () => {
      component.imageData = {
        mainUrl: MOCK_MAIN_URL,
        mainWidth: 1920,
        mainHeight: 1080,
      };
      fixture.detectChanges();

      directive.ngOnInit();

      expect(directive.aspectRatio).toBe('16 / 9');
    });

    it('should display shimmer effect when no URLs are provided', () => {
      component.imageData = {
        caption: 'Test',
      };
      fixture.detectChanges();

      directive.ngOnInit();

      expect(directive.currentSrc).toContain('data:image/gif');
      expect(directive.background).toBe(
        'var(--lcc-color--contentPlaceholder-background)',
      );
    });

    it('should use thumbnailUrl when mainUrl is not available', () => {
      component.imageData = {
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
      };
      fixture.detectChanges();

      directive.ngOnInit();

      expect(directive.currentSrc).toBe('https://example.com/thumbnail.jpg');
    });
  });

  describe('onImageLoad', () => {
    it('should remove shimmer effect on load', () => {
      // @ts-expect-error Private class member
      const removeShimmerSpy = jest.spyOn(directive, 'removeShimmerEffect');

      directive['onImageLoad']();

      expect(removeShimmerSpy).toHaveBeenCalled();
    });

    it('should load full image after thumbnail loads', () => {
      component.imageData = {
        mainUrl: 'https://example.com/full.jpg',
        thumbnailUrl: 'https://example.com/thumb.jpg',
      };
      fixture.detectChanges();

      directive.currentSrc = 'https://example.com/thumb.jpg';
      directive['onImageLoad']();

      expect(directive.filter).toBe('blur(3px)');
    });

    it('should not blur when mainUrl is already loaded', () => {
      component.imageData = {
        mainUrl: 'https://example.com/full.jpg',
      };
      fixture.detectChanges();

      directive.currentSrc = 'https://example.com/full.jpg';
      directive['onImageLoad']();

      expect(directive.filter).toBe('none');
    });
  });

  describe('onImageError', () => {
    it('should set image to main URL on error if defined', () => {
      directive['onImageError']();

      expect(directive.currentSrc).toBe(MOCK_MAIN_URL);
    });

    it('should set fallback image on error if main URL if undefined', () => {
      directive.image = undefined;
      directive['onImageError']();

      expect(directive.currentSrc).toBe('assets/fallback-image.png');
    });

    it('should remove shimmer effect on error', () => {
      // @ts-expect-error Private class member
      const removeShimmerSpy = jest.spyOn(directive, 'removeShimmerEffect');

      directive['onImageError']();

      expect(removeShimmerSpy).toHaveBeenCalled();
    });
  });

  describe('aspect ratio', () => {
    it('should set correct aspect ratio for different dimensions', () => {
      const testCases = [
        { width: 1920, height: 1080, expected: '16 / 9' },
        { width: 800, height: 600, expected: '4 / 3' },
        { width: 1200, height: 1200, expected: '1 / 1' },
      ];

      testCases.forEach(({ width, height, expected }) => {
        component.imageData = {
          mainUrl: MOCK_MAIN_URL,
          mainWidth: width,
          mainHeight: height,
        };
        fixture.detectChanges();

        directive.ngOnInit();

        expect(directive.aspectRatio).toBe(expected);
      });
    });

    it('should set width and height attributes on img element', () => {
      component.imageData = {
        mainUrl: MOCK_MAIN_URL,
        mainWidth: 1920,
        mainHeight: 1080,
      };
      fixture.detectChanges();

      directive.ngOnInit();

      expect(imgElement.nativeElement.getAttribute('width')).toBe('1920');
      expect(imgElement.nativeElement.getAttribute('height')).toBe('1080');
    });
  });

  describe('shimmer effect', () => {
    it('should create shimmer element when displaying placeholder', () => {
      component.imageData = {};
      fixture.detectChanges();

      directive.ngOnInit();

      // @ts-expect-error Private class member
      expect(directive.skeletonElement).toBeTruthy();
    });

    it('should remove shimmer element when image loads', () => {
      component.imageData = {};
      fixture.detectChanges();

      directive.ngOnInit();

      // @ts-expect-error Private class member
      expect(directive.skeletonElement).toBeTruthy();

      component.imageData = { mainUrl: 'https://example.com/image.jpg' };
      fixture.detectChanges();

      // @ts-expect-error Private class member
      expect(directive.skeletonElement).toBeFalsy();
    });
  });

  describe('styling', () => {
    it('should apply transition styles', () => {
      expect(directive.transition).toBe('filter 0.3s ease, opacity 0.3s ease');
    });

    it('should have initial filter as none', () => {
      expect(directive.filter).toBe('none');
    });

    it('should have initial opacity as 1', () => {
      expect(directive.opacity).toBe('1');
    });
  });
});
