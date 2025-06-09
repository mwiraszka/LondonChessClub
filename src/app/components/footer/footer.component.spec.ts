import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent, RouterModule.forRoot([])],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
      });
  });

  describe('copyright notice', () => {
    it('should render the copyright notice section', () => {
      expect(element('.copyright-notice')).not.toBeNull();
    });

    it('should include the current year', () => {
      // @ts-expect-error Private class member
      component.currentYear = 2088;
      fixture.detectChanges();

      expect(elementTextContent('.copyright-notice')).toBe(
        'Copyright © 2088 London Chess Club',
      );
    });
  });

  describe('website details', () => {
    it('should render the website details section', () => {
      expect(element('.website-details')).not.toBeNull();
    });

    it('should include the current app version', () => {
      // @ts-expect-error Private class member
      component.currentVersion = '1.2.3';
      fixture.detectChanges();

      expect(elementTextContent('.current-version')).toBe('v1.2.3');
    });
  });

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  function elementTextContent(selector: string): string {
    return element(selector).nativeElement.textContent.trim();
  }
});
