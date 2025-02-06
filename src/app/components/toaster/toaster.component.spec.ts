import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { MOCK_TOASTS } from '@app/mocks/toasts.mock';

import { ToasterComponent } from './toaster.component';

describe('ToasterComponent', () => {
  let fixture: ComponentFixture<ToasterComponent>;
  let component: ToasterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToasterComponent, RouterModule.forRoot([])],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ToasterComponent);
        component = fixture.componentInstance;
        component.toasts = MOCK_TOASTS;
        fixture.detectChanges();
      });
  });

  it('should render all toasts and the ', () => {
    expect(elements('.toast').length).toBe(MOCK_TOASTS.length);
  });

  it('should apply correct classes and render correct content within each toast', () => {
    elements('.toast').forEach((element, i) => {
      expect(element.attributes['class']).toContain(`toast-${MOCK_TOASTS[i].type}`);

      expect(element.query(By.css('.toast-title')).nativeElement.textContent).toBe(
        MOCK_TOASTS[i].title,
      );

      expect(element.query(By.css('.toast-message')).nativeElement.textContent).toBe(
        MOCK_TOASTS[i].message,
      );

      const iconName = component.getIcon(MOCK_TOASTS[i].type);
      expect(element.query(By.css('.icon')).attributes['ng-reflect-name']).toBe(iconName);
    });
  });

  function elements(selector: string): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(selector));
  }
});
