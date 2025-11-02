import { provideMockStore } from '@ngrx/store/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSelectors } from '@app/store/auth';
import { query } from '@app/utils';

import { SessionExpiryDialogComponent } from './session-expiry-dialog.component';

describe('SessionExpiryDialogComponent', () => {
  let fixture: ComponentFixture<SessionExpiryDialogComponent>;
  let component: SessionExpiryDialogComponent;

  let dialogResultSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpiryDialogComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: AuthSelectors.selectSessionStartTime, value: Date.now() },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionExpiryDialogComponent);
    component = fixture.componentInstance;

    dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');

    component.sessionDurationMs = 60_000;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('dialog result handling', () => {
    it('should emit "cancel" when cancel button is clicked', () => {
      query(fixture.debugElement, '.cancel-button').triggerEventHandler('click');

      expect(dialogResultSpy).toHaveBeenCalledWith('cancel');
    });

    it('should emit "logout" when logout button is clicked', () => {
      query(fixture.debugElement, '.logout-button').triggerEventHandler('click');

      expect(dialogResultSpy).toHaveBeenCalledWith('logout');
    });

    it('should emit "extend" when extend button is clicked', () => {
      query(fixture.debugElement, '.extend-button').triggerEventHandler('click');

      expect(dialogResultSpy).toHaveBeenCalledWith('extend');
    });

    it('should emit "extend" when enter key is pressed', () => {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      document.dispatchEvent(enterEvent);

      expect(dialogResultSpy).toHaveBeenCalledWith('extend');
    });
  });
});
