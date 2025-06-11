import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { query, queryTextContent } from '@app/utils';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterModule.forRoot([])],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();
      });
  });

  describe('branding section', () => {
    it('should include the LCC brand image', () => {
      expect(
        query(fixture.debugElement, '.branding-link img').nativeElement,
      ).not.toBeNull();
    });

    it('should link to the homepage via the LCC brand image', () => {
      expect(query(fixture.debugElement, '.branding-link').attributes['routerLink']).toBe(
        '',
      );
    });

    it('should include the club name', () => {
      expect(queryTextContent(fixture.debugElement, '.club-name-link')).toBe(
        'London Chess Club',
      );
    });

    it('should link to the homepage via the club name text', () => {
      expect(
        query(fixture.debugElement, '.club-name-link').attributes['routerLink'],
      ).toBe('');
    });
  });

  describe('chess pieces section', () => {
    it('should display the chess pieces SVG 5 times', () => {
      const imageElements = fixture.debugElement.queryAll(By.css('.chess-pieces img'));

      expect(imageElements.length).toBe(5);

      imageElements.forEach(element => {
        expect(element.attributes['src']).toBe('assets/chess-pieces.svg');
      });
    });
  });
});
