import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

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
      expect(element('.branding-link img').nativeElement).not.toBeNull();
    });

    it('should link to the homepage via the LCC brand image', () => {
      expect(element('.branding-link').attributes['routerLink']).toBe('');
    });

    it('should include the club name', () => {
      expect(elementTextContent('.club-name-link')).toBe('London Chess Club');
    });

    it('should link to the homepage via the club name text', () => {
      expect(element('.club-name-link').attributes['routerLink']).toBe('');
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

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  function elementTextContent(selector: string): string {
    return element(selector).nativeElement.textContent.trim();
  }
});
