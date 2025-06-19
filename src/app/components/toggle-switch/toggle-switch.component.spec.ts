import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipDirective } from '@app/directives/tooltip.directive';
import { query, queryTextContent } from '@app/utils';

import { ToggleSwitchComponent } from './toggle-switch.component';

describe('ToggleSwitchComponent', () => {
  let fixture: ComponentFixture<ToggleSwitchComponent>;
  let component: ToggleSwitchComponent;

  let input: DebugElement;
  let emitSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TooltipDirective, ToggleSwitchComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ToggleSwitchComponent);
        component = fixture.componentInstance;

        component.iconTooltipWhenOff = 'Mock tooltip';
        component.iconWhenOn = 'visibility';
        component.iconWhenOff = 'visibility_off';
        component.tooltipWhenOff = 'Tooltip when off';
        component.tooltipWhenOn = 'Tooltip when on';

        input = fixture.debugElement.query(By.css('input[type="checkbox"]'));
        emitSpy = jest.spyOn(component.toggle, 'emit');

        fixture.detectChanges();
      });
  });

  it('should generate a unique ID on initialization', () => {
    expect(component.uniqueId).toBeDefined();
    expect(component.uniqueId.length).toBe(8);
  });

  describe('when switched off', () => {
    beforeEach(() => {
      component.switchedOn = false;
      fixture.detectChanges();
    });

    it('should have unchecked input', () => {
      expect(
        query(fixture.debugElement, 'input[type="checkbox"]').nativeElement.checked,
      ).toBe(false);
    });

    it('should show iconWhenOff if icon is provided', () => {
      expect(queryTextContent(fixture.debugElement, 'mat-icon')).toBe('visibility_off');
    });

    it('should not display any icon if iconWhenOff is not provided', () => {
      component.iconWhenOff = undefined;
      fixture.detectChanges();

      expect(query(fixture.debugElement, 'mat-icon')).toBeNull();
    });

    it('should apply iconTooltipWhenOff to icon if tooltip is provided', () => {
      const tooltipDirective = query(fixture.debugElement, 'mat-icon').injector.get(
        TooltipDirective,
      );
      expect(tooltipDirective.tooltip).toBe('Mock tooltip');
    });

    it('should not apply tooltip to icon if iconTooltipWhenOff is not provided', () => {
      component.iconTooltipWhenOff = null;
      fixture.detectChanges();

      const tooltipDirective = query(fixture.debugElement, 'mat-icon').injector.get(
        TooltipDirective,
      );
      expect(tooltipDirective.tooltip).toBeNull();
    });

    it('should apply warning class when warningWhenOff is true', () => {
      component.warningWhenOff = true;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.slider').classes['warning']).toBe(true);
    });

    it('should apply warning class when warningWhenOff is false', () => {
      expect(query(fixture.debugElement, '.slider').classes['warning']).toBeUndefined();
    });

    it('should emit toggle event when switched on', () => {
      input.nativeElement.click();
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when switched on', () => {
    beforeEach(() => {
      component.switchedOn = true;
      fixture.detectChanges();
    });

    it('should have checked input', () => {
      expect(input.nativeElement.checked).toBe(true);
    });

    it('should show iconWhenOn if icon is provided', () => {
      expect(queryTextContent(fixture.debugElement, 'mat-icon')).toBe('visibility');
    });

    it('should not display any icon if iconWhenOn is not provided', () => {
      component.iconWhenOn = undefined;
      fixture.detectChanges();

      expect(query(fixture.debugElement, 'mat-icon')).toBeNull();
    });

    it('should not warning class when warningWhenOff is true', () => {
      component.warningWhenOff = true;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.slider').classes['warning']).toBeUndefined();
    });

    it('should not apply warning class when warningWhenOff is false', () => {
      expect(query(fixture.debugElement, '.slider').classes['warning']).toBeUndefined();
    });

    it('should emit toggle event when switched off', () => {
      input.nativeElement.click();
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle tooltip refresh on toggle', fakeAsync(() => {
    // @ts-expect-error Private class member
    const tooltipAttachSpy = jest.spyOn(component.tooltipDirective, 'attach');
    // @ts-expect-error Private class member
    const tooltipDetachSpy = jest.spyOn(component.tooltipDirective, 'detach');

    component.onToggleChange();

    expect(tooltipAttachSpy).not.toHaveBeenCalled();
    expect(tooltipDetachSpy).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
    tick(1);

    expect(tooltipAttachSpy).toHaveBeenCalledTimes(1);
    expect(tooltipDetachSpy).not.toHaveBeenCalled();
  }));
});
