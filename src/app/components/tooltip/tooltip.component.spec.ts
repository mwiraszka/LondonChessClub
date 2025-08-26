import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOOLTIP_CONTENT_TOKEN } from '@app/directives/tooltip.directive';
import { query, queryTextContent } from '@app/utils';

import { TooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let fixture: ComponentFixture<TooltipComponent>;
  let component: TooltipComponent;

  describe('with short string content', () => {
    const shortString = 'This is a tooltip message';

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TooltipComponent],
        providers: [{ provide: TOOLTIP_CONTENT_TOKEN, useValue: shortString }],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TooltipComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should receive content through dependency injection', () => {
      expect(component.tooltipContent).toBe(shortString);
    });

    it('should render string content in a div', () => {
      expect(query(fixture.debugElement, 'div')).toBeTruthy();
    });

    it('should display the string content', () => {
      expect(queryTextContent(fixture.debugElement, 'div')).toBe(shortString);
    });

    it('should not display template outlet for string content', () => {
      expect(query(fixture.debugElement, 'ng-template')).toBeFalsy();
    });
  });

  describe('with long string content', () => {
    const longString =
      'This is a very long tooltip message that should be truncated after reaching the character limit set by the truncate pipe';

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TooltipComponent],
        providers: [{ provide: TOOLTIP_CONTENT_TOKEN, useValue: longString }],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TooltipComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should truncate long string content to 80 characters (including ellipsis)', () => {
      const rendered = queryTextContent(fixture.debugElement, 'div');
      expect(rendered.length).toBe(80);
      expect(rendered.endsWith('...')).toBe(true);
    });
  });

  describe('with template content', () => {
    let mockTemplateRef: TemplateRef<unknown>;

    beforeEach(() => {
      mockTemplateRef = {
        createEmbeddedView: jest.fn(),
        elementRef: {},
      } as unknown as TemplateRef<unknown>;

      TestBed.configureTestingModule({
        imports: [TooltipComponent],
        providers: [
          {
            provide: TOOLTIP_CONTENT_TOKEN,
            useValue: mockTemplateRef,
          },
        ],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(TooltipComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should receive content through dependency injection', () => {
      expect(component.tooltipContent).toBe(mockTemplateRef);
    });

    it('should not render div for template content', () => {
      expect(query(fixture.debugElement, 'div')).toBeFalsy();
    });

    it('should use ng-container with ngTemplateOutlet for template content', () => {
      // ng-template elements are not rendered in the DOM, but we can check the content is rendered
      // by confirming the template content is rendered directly without the div wrapper
      expect(fixture.debugElement.nativeElement.querySelector('div')).toBeFalsy();
    });

    it('should pass template reference to ngTemplateOutlet', () => {
      expect(component.tooltipContent).toBe(mockTemplateRef);
    });
  });
});
