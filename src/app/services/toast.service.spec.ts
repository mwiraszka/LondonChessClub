import { OverlayModule } from '@angular/cdk/overlay';
import { Component, Input } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Toast } from '@app/models';

import { ToastService } from './toast.service';

@Component({
  selector: 'lcc-toaster',
  template: '<div class="toaster">{{toasts.length}} toasts</div>',
  standalone: true,
})
class MockToasterComponent {
  @Input() toasts: Toast[] = [];
}

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, MockToasterComponent],
      providers: [ToastService],
    });

    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('displayToast', () => {
    it('should add toast and create overlay', () => {
      const toast: Toast = {
        title: 'Toast 1',
        message: 'Test message',
        type: 'success',
      };

      service.displayToast(toast);

      expect(service['activeToasts']).toContainEqual(toast);
      expect(service['overlayRef']).toBeTruthy();
    });

    it('should limit toasts to 5', () => {
      const toasts: Toast[] = Array.from({ length: 7 }, (_, i) => ({
        title: `Toast ${i + 1}`,
        message: `Message ${i + 1}`,
        type: 'info',
      }));

      toasts.forEach(toast => service.displayToast(toast));

      expect(service['activeToasts']).toHaveLength(5);
      expect(service['activeToasts'][0].title).toBe('Toast 3');
      expect(service['activeToasts'][4].title).toBe('Toast 7');
    });

    it('should auto-remove toast after duration', fakeAsync(() => {
      const toast: Toast = {
        title: 'Toast 1',
        message: 'Auto remove test',
        type: 'warning',
      };

      service.displayToast(toast);
      expect(service['activeToasts']).toContainEqual(toast);

      tick(ToastService.TOAST_DURATION);

      expect(service['activeToasts']).not.toContainEqual(toast);
      expect(service['overlayRef']).toBeNull();
    }));

    it('should position overlay based on screen width', () => {
      const toast: Toast = {
        title: 'Toast 1',
        message: 'Position test',
        type: 'info',
      };

      const matchMediaSpy = jest.spyOn(window, 'matchMedia');

      const createMockMQL = (matches: boolean): MediaQueryList => ({
        matches,
        media: '(max-width: 1000px)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      });

      matchMediaSpy.mockReturnValue(createMockMQL(false));
      service.displayToast(toast);
      service['destroyOverlay']();

      matchMediaSpy.mockReturnValue(createMockMQL(true));
      service.displayToast(toast);

      expect(matchMediaSpy).toHaveBeenCalledWith('(max-width: 1000px)');
    });
  });

  describe('removeToast', () => {
    it('should remove specific toast', () => {
      const toast1: Toast = { title: 'Toast 1', message: 'Message 1', type: 'success' };
      const toast2: Toast = { title: 'Toast 2', message: 'Message 2', type: 'info' };

      service.displayToast(toast1);
      service.displayToast(toast2);

      service.removeToast(toast1);

      expect(service['activeToasts']).not.toContainEqual(toast1);
      expect(service['activeToasts']).toContainEqual(toast2);
    });

    it('should clear timer when removing toast', () => {
      const toast: Toast = {
        title: 'Toast 1',
        message: 'Timer test',
        type: 'info',
      };

      service.displayToast(toast);
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

      service.removeToast(toast);

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should destroy overlay when last toast is removed', () => {
      const toast: Toast = {
        title: 'Toast 1',
        message: 'Last toast',
        type: 'success',
      };

      service.displayToast(toast);
      expect(service['overlayRef']).toBeTruthy();

      service.removeToast(toast);
      expect(service['overlayRef']).toBeNull();
    });

    it('should update toaster component when not last toast', () => {
      const toast1: Toast = { title: 'Toast 1', message: 'Message 1', type: 'info' };
      const toast2: Toast = { title: 'Toast 2', message: 'Message 2', type: 'warning' };

      service.displayToast(toast1);
      service.displayToast(toast2);

      // @ts-expect-error Private class member
      const updateSpy = jest.spyOn(service, 'updateToasterComponent');

      service.removeToast(toast1);

      expect(updateSpy).toHaveBeenCalled();
      expect(service['overlayRef']).toBeTruthy();
    });
  });

  describe('multiple toasts interaction', () => {
    it('should handle multiple toasts with different timers', fakeAsync(() => {
      // Mock matchMedia for this test - include addListener/removeListener for CDK compatibility
      const mockMatchMedia = jest.fn().mockReturnValue({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      });
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      });

      const toast1: Toast = { title: 'Toast 1', message: 'Message 1', type: 'success' };
      const toast2: Toast = { title: 'Toast 2', message: 'Message 2', type: 'info' };

      service.displayToast(toast1);
      tick(1000);
      service.displayToast(toast2);

      expect(service['activeToasts']).toHaveLength(2);

      tick(ToastService.TOAST_DURATION - 1000);
      expect(service['activeToasts']).toHaveLength(1);
      expect(service['activeToasts'][0].title).toBe('Toast 2');

      tick(1000);
      expect(service['activeToasts']).toHaveLength(0);
    }));

    it('should reuse overlay for multiple toasts', () => {
      const toast1: Toast = { title: 'Toast 1', message: 'Message 1', type: 'info' };
      const toast2: Toast = { title: 'Toast 2', message: 'Message 2', type: 'warning' };

      service.displayToast(toast1);
      const firstOverlayRef = service['overlayRef'];

      service.displayToast(toast2);
      const secondOverlayRef = service['overlayRef'];

      expect(firstOverlayRef).toBe(secondOverlayRef);
    });
  });

  describe('edge cases', () => {
    it('should handle removing non-existent toast', () => {
      const existingToast: Toast = {
        title: 'Toast 1',
        message: 'Existing',
        type: 'info',
      };
      const nonExistentToast: Toast = {
        title: 'Toast 2',
        message: 'Non-existent',
        type: 'info',
      };

      service.displayToast(existingToast);

      expect(() => service.removeToast(nonExistentToast)).not.toThrow();
      expect(service['activeToasts']).toContainEqual(existingToast);
    });

    it('should clear all timers when overlay is destroyed', () => {
      const toasts: Toast[] = [
        { title: 'Toast 1', message: 'Message 1', type: 'success' },
        { title: 'Toast 2', message: 'Message 2', type: 'info' },
        { title: 'Toast 3', message: 'Message 3', type: 'warning' },
      ];

      toasts.forEach(toast => service.displayToast(toast));

      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

      service['destroyOverlay']();

      expect(clearTimeoutSpy).toHaveBeenCalledTimes(3);
      expect(service['toastTimers'].size).toBe(0);
    });
  });
});
