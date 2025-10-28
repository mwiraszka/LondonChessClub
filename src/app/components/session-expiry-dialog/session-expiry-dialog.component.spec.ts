import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { query } from '@app/utils';

import { SessionExpiryDialogComponent } from './session-expiry-dialog.component';

describe('SessionExpiryDialogComponent', () => {
  let fixture: ComponentFixture<SessionExpiryDialogComponent>;
  let component: SessionExpiryDialogComponent;

  let dialogResultSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpiryDialogComponent],
      providers: [{ provide: Renderer2, useValue: { listen: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionExpiryDialogComponent);
    component = fixture.componentInstance;

    dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');

    component.initialTimeToExpiryMs = 100;
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
