import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { TooltipDirective } from '@app/directives/tooltip.directive';
import { query, queryTextContent } from '@app/utils';
import { hasSpecialCharValidator } from '@app/validators';

import { FormErrorIconComponent } from './form-error-icon.component';

describe('FormErrorIconComponent', () => {
  let fixture: ComponentFixture<FormErrorIconComponent>;
  let component: FormErrorIconComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormErrorIconComponent, TooltipDirective],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FormErrorIconComponent);
        component = fixture.componentInstance;
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should render visible icon if control is touched and invalid', () => {
      component.control = new FormControl('', {
        validators: Validators.required,
      });
      component.control.markAsTouched();
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, 'mat-icon')).toBe('warning_amber');
      expect(fixture.nativeElement.querySelector('mat-icon').style.visibility).toBe(
        'visible',
      );
    });

    it('should render hidden icon if control is invalid but not touched', () => {
      component.control = new FormControl('', {
        validators: Validators.required,
      });
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, 'mat-icon')).toBe('warning_amber');
      expect(fixture.nativeElement.querySelector('mat-icon').style.visibility).toBe(
        'hidden',
      );
    });

    it('should render hidden icon if control is touched but not invalid', () => {
      component.control = new FormControl('hello world', {
        validators: Validators.required,
      });
      component.control.markAsTouched();
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, 'mat-icon')).toBe('warning_amber');
      expect(fixture.nativeElement.querySelector('mat-icon').style.visibility).toBe(
        'hidden',
      );
    });

    it('should display first listed error message in tooltip if control has multiple errors', () => {
      component.control = new FormControl('test', {
        validators: [Validators.required, hasSpecialCharValidator],
      });
      component.control.markAsTouched();
      fixture.detectChanges();

      const tooltipDirective = query(fixture.debugElement, 'mat-icon').injector.get(
        TooltipDirective,
      );

      expect(tooltipDirective.tooltip).toBe(
        'Must include at least one special character',
      );

      component.control.setValue('');
      fixture.detectChanges();

      expect(tooltipDirective.tooltip).toBe('This field is required');
    });
  });
});
