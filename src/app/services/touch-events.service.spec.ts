import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import * as deviceUtils from '@app/utils';

import { TouchEventsService } from './touch-events.service';

describe('TouchEventsService', () => {
  let service: TouchEventsService;
  let mockDocument: Document;

  let addEventListenerSpy: jest.SpyInstance;
  let clearTimeoutSpy: jest.SpyInstance;
  let isTouchDeviceSpy: jest.SpyInstance;
  let setTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    mockDocument = document.implementation.createHTMLDocument();

    TestBed.configureTestingModule({
      providers: [TouchEventsService, { provide: DOCUMENT, useValue: mockDocument }],
    });

    service = TestBed.inject(TouchEventsService);

    addEventListenerSpy = jest.spyOn(mockDocument, 'addEventListener');
    clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    isTouchDeviceSpy = jest.spyOn(deviceUtils, 'isTouchDevice');
    setTimeoutSpy = jest.spyOn(window, 'setTimeout');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listenForTouchEvents', () => {
    it('should not add event listeners if device is not touch-enabled', () => {
      isTouchDeviceSpy.mockReturnValue(false);

      service.listenForTouchEvents();

      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should add event listeners if device is touch-enabled', () => {
      isTouchDeviceSpy.mockReturnValue(true);

      service.listenForTouchEvents();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        { passive: false },
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function), {
        passive: false,
      });
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'contextmenu',
        expect.any(Function),
        { capture: true, passive: false },
      );
    });
  });

  describe('touch event handling', () => {
    let touchStartHandler: (event: TouchEvent) => void;
    let touchEndHandler: () => void;

    beforeEach(() => {
      isTouchDeviceSpy.mockReturnValue(true);

      service.listenForTouchEvents();

      touchStartHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'touchstart',
      )?.[1] as (event: TouchEvent) => void;
      touchEndHandler = addEventListenerSpy.mock.calls.find(
        call => call[0] === 'touchend',
      )?.[1] as () => void;
    });

    it('should set timeout on single touch start', () => {
      const touchEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
      } as unknown as TouchEvent;

      touchStartHandler(touchEvent);

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);
    });

    it('should not set timeout on multi-touch', () => {
      const touchEvent = {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 },
        ],
      } as unknown as TouchEvent;

      touchStartHandler(touchEvent);

      expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    it('should clear timeout on touch end', () => {
      const touchStartEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
      } as unknown as TouchEvent;

      touchStartHandler(touchStartEvent);
      touchEndHandler();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should dispatch contextmenu event on long press for admin controls', () => {
      jest.useFakeTimers();

      const element = mockDocument.createElement('div');
      element.setAttribute('adminControls', '');
      mockDocument.body.appendChild(element);

      const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');

      const touchEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: element,
        preventDefault: jest.fn(),
      } as unknown as TouchEvent;

      touchStartHandler(touchEvent);
      jest.advanceTimersByTime(500);

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'contextmenu',
          clientX: 100,
          clientY: 200,
        }),
      );

      jest.useRealTimers();
    });

    it('should not dispatch contextmenu for elements without admin controls', () => {
      const dispatchEventSpy = jest.spyOn(mockDocument, 'dispatchEvent');

      jest.useFakeTimers();

      const element = mockDocument.createElement('div');
      mockDocument.body.appendChild(element);

      const touchEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: element,
      } as unknown as TouchEvent;

      touchStartHandler(touchEvent);
      jest.advanceTimersByTime(500);

      expect(dispatchEventSpy).not.toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should check parent elements for admin controls attribute', () => {
      jest.useFakeTimers();

      const parent = mockDocument.createElement('div');
      parent.setAttribute('adminControls', '');
      const child = mockDocument.createElement('span');
      parent.appendChild(child);
      mockDocument.body.appendChild(parent);

      const dispatchEventSpy = jest.spyOn(child, 'dispatchEvent');

      const touchEvent = {
        touches: [{ clientX: 150, clientY: 250 }],
        target: child,
        preventDefault: jest.fn(),
      } as unknown as TouchEvent;

      touchStartHandler(touchEvent);
      jest.advanceTimersByTime(500);

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'contextmenu',
        }),
      );

      jest.useRealTimers();
    });

    it('should prevent contextmenu when tooltip is open', () => {
      const tooltipContainer = mockDocument.createElement('div');
      tooltipContainer.className = 'cdk-overlay-container';
      const tooltip = mockDocument.createElement('lcc-tooltip');
      tooltipContainer.appendChild(tooltip);
      mockDocument.body.appendChild(tooltipContainer);

      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = jest.spyOn(contextMenuEvent, 'preventDefault');

      mockDocument.dispatchEvent(contextMenuEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not prevent contextmenu when tooltip is not open', () => {
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = jest.spyOn(contextMenuEvent, 'preventDefault');

      mockDocument.dispatchEvent(contextMenuEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should clear text selection on long press for admin controls', () => {
      jest.useFakeTimers();

      const element = mockDocument.createElement('div');
      element.setAttribute('adminControls', '');
      mockDocument.body.appendChild(element);

      const mockSelection = {
        removeAllRanges: jest.fn(),
      };
      jest
        .spyOn(window, 'getSelection')
        .mockReturnValue(mockSelection as unknown as Selection);

      const touchEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: element,
        preventDefault: jest.fn(),
      } as unknown as TouchEvent;

      touchStartHandler(touchEvent);
      jest.advanceTimersByTime(500);

      expect(mockSelection.removeAllRanges).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
