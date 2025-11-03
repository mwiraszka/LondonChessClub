import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { query } from '@app/utils';

import { SessionExpiryDialogComponent } from './session-expiry-dialog.component';

describe('SessionExpiryDialogComponent', () => {
  let fixture: ComponentFixture<SessionExpiryDialogComponent>;
  let component: SessionExpiryDialogComponent;

  let dialogResultSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpiryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionExpiryDialogComponent);
    component = fixture.componentInstance;

    dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');

    component.initialTimeRemainingSecs = 60;
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

    it('should emit "expire" when time remaining reaches 0', fakeAsync(() => {
      component.initialTimeRemainingSecs = 2;

      // Subscribe to the observable to actually trigger the timer logic
      component.timeRemainingSecs$.subscribe();

      // Timer emits immediately at 0ms: 2 - 0 = 2 (not expired)
      tick(0);
      expect(dialogResultSpy).not.toHaveBeenCalled();

      // Advance 1 second: 2 - 1 = 1 (not expired)
      tick(1000);
      expect(dialogResultSpy).not.toHaveBeenCalled();

      // Advance 1 more second: 2 - 2 = 0 (expired)
      tick(1000);
      expect(dialogResultSpy).toHaveBeenCalledWith('expire');
    }));
  });
});
