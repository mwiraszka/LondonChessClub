import { TestBed } from '@angular/core/testing';

import * as deviceUtils from '@app/utils';

import { KeyStateService } from './key-state.service';

describe('KeyStateService', () => {
  let service: KeyStateService;

  let isMacSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyStateService],
    });

    service = TestBed.inject(KeyStateService);

    isMacSpy = jest.spyOn(deviceUtils, 'isMac');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ctrlMetaKeyPressed$', () => {
    it('should emit false initially', done => {
      service.ctrlMetaKeyPressed$.subscribe(pressed => {
        expect(pressed).toBe(false);
        done();
      });
    });

    it('should emit true when Control key pressed on non-Mac', done => {
      isMacSpy.mockReturnValue(false);

      service.ctrlMetaKeyPressed$.subscribe(pressed => {
        if (pressed) {
          expect(pressed).toBe(true);
          done();
        }
      });

      const event = new KeyboardEvent('keydown', { key: 'Control' });
      document.dispatchEvent(event);
    });

    it('should emit false when Control key released on non-Mac', done => {
      isMacSpy.mockReturnValue(false);

      let firstEmission = true;

      service.ctrlMetaKeyPressed$.subscribe(pressed => {
        if (!firstEmission && !pressed) {
          expect(pressed).toBe(false);
          done();
        }
        firstEmission = false;
      });

      const keydownEvent = new KeyboardEvent('keydown', { key: 'Control' });
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', { key: 'Control' });
      document.dispatchEvent(keyupEvent);
    });

    it('should emit true when Meta key pressed on Mac', done => {
      isMacSpy.mockReturnValue(true);

      service.ctrlMetaKeyPressed$.subscribe(pressed => {
        if (pressed) {
          expect(pressed).toBe(true);
          done();
        }
      });

      const event = new KeyboardEvent('keydown', { key: 'Meta' });
      document.dispatchEvent(event);
    });

    it('should emit false when Meta key released on Mac', done => {
      isMacSpy.mockReturnValue(true);

      let firstEmission = true;

      service.ctrlMetaKeyPressed$.subscribe(pressed => {
        if (!firstEmission && !pressed) {
          expect(pressed).toBe(false);
          done();
        }
        firstEmission = false;
      });

      const keydownEvent = new KeyboardEvent('keydown', { key: 'Meta' });
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', { key: 'Meta' });
      document.dispatchEvent(keyupEvent);
    });

    it('should not emit for Meta key on non-Mac', () => {
      isMacSpy.mockReturnValue(false);

      const emissions: boolean[] = [];

      service.ctrlMetaKeyPressed$.subscribe(pressed => {
        emissions.push(pressed);
      });

      const event = new KeyboardEvent('keydown', { key: 'Meta' });
      document.dispatchEvent(event);

      expect(emissions).toEqual([false]);
    });

    it('should not emit for Control key on Mac', () => {
      isMacSpy.mockReturnValue(true);

      const emissions: boolean[] = [];

      service.ctrlMetaKeyPressed$.subscribe(pressed => {
        emissions.push(pressed);
      });

      const event = new KeyboardEvent('keydown', { key: 'Control' });
      document.dispatchEvent(event);

      expect(emissions).toEqual([false]);
    });

    it('should ignore other keys', () => {
      isMacSpy.mockReturnValue(false);

      const emissions: boolean[] = [];

      service.ctrlMetaKeyPressed$.subscribe(pressed => {
        emissions.push(pressed);
      });

      const event = new KeyboardEvent('keydown', { key: 'a' });
      document.dispatchEvent(event);

      expect(emissions).toEqual([false]);
    });
  });
});
