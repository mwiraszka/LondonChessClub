import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { query, queryTextContent } from '@app/utils';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('copyright notice', () => {
    it('should render the copyright notice section', () => {
      expect(query(fixture.debugElement, '.copyright-notice')).not.toBeNull();
    });

    it('should include the current year', () => {
      // @ts-expect-error Private class member
      component.currentYear = 2088;
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.copyright-notice')).toBe(
        'Copyright © 2088 London Chess Club',
      );
    });
  });

  describe('website details', () => {
    it('should render the website details section', () => {
      expect(query(fixture.debugElement, '.website-details')).not.toBeNull();
    });

    it('should include the current app version', () => {
      // @ts-expect-error Private class member
      component.currentVersion = '1.2.3';
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.current-version')).toBe('v1.2.3');
    });
  });
});
