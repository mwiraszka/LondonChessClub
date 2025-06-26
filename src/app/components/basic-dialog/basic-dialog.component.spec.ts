import { Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { query, queryTextContent } from '@app/utils';

import { BasicDialogComponent } from './basic-dialog.component';

describe('BasicDialogComponent', () => {
  let fixture: ComponentFixture<BasicDialogComponent>;
  let component: BasicDialogComponent;

  const mockDialog = {
    title: 'Dialog Title',
    body: 'Body of the mock dialog',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    confirmButtonType: 'primary' as const,
  };

  const mockWarningDialog = {
    title: 'Warning Dialog Title',
    body: 'Body of the mock warning dialog',
    confirmButtonText: 'Delete',
    confirmButtonType: 'warning' as const,
  };

  let dialogResultSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDialogComponent],
      providers: [{ provide: Renderer2, useValue: { listen: jest.fn() } }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BasicDialogComponent);
        component = fixture.componentInstance;

        component.dialog = mockDialog;
        dialogResultSpy = jest.spyOn(component.dialogResult, 'emit');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dialog title and body', () => {
    expect(queryTextContent(fixture.debugElement, 'h3')).toBe(mockDialog.title);
    expect(queryTextContent(fixture.debugElement, 'p')).toBe(mockDialog.body);
  });

  it('should emit "cancel" when cancel button is clicked', () => {
    query(fixture.debugElement, '.cancel-button').triggerEventHandler('click');

    expect(dialogResultSpy).toHaveBeenCalledWith('cancel');
  });

  it('should emit "confirm" when confirm button is clicked', () => {
    query(fixture.debugElement, '.confirm-button').triggerEventHandler('click');

    expect(dialogResultSpy).toHaveBeenCalledWith('confirm');
  });

  it('should emit "confirm" when enter key is pressed', () => {
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
    });
    document.dispatchEvent(enterEvent);

    expect(dialogResultSpy).toHaveBeenCalledWith('confirm');
  });

  it('should use default cancel text if not provided', () => {
    component.dialog = mockWarningDialog;
    fixture.detectChanges();

    expect(queryTextContent(fixture.debugElement, '.cancel-button')).toBe('Cancel');
  });
});
