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
      expect(getDebugElement('.copyright-notice')).not.toBeNull();
    });

    it('should include the current year', () => {
      // @ts-expect-error Private class member
      component.currentYear = 2088;
      fixture.detectChanges();

      expect(getDebugElement('.copyright-notice')?.nativeElement.textContent.trim()).toBe(
        'Copyright © 2088 London Chess Club',
      );
    });
  });

  describe('website details', () => {
    it('should render the website details section', () => {
      fixture.detectChanges();

      expect(getDebugElement('.website-details')).not.toBeNull();
    });

    it('should include the current app version', () => {
      // @ts-expect-error Private class member
      component.currentVersion = '1.2.3';
      fixture.detectChanges();

      expect(getDebugElement('.current-version')?.nativeElement.textContent.trim()).toBe(
        'v1.2.3',
      );
    });
  });

  function getDebugElement(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }
});
