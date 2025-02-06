import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import IconsModule from '@app/icons';

import { ScreenHeaderComponent } from './screen-header.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<ScreenHeaderComponent>;
  let component: ScreenHeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconsModule, RouterModule.forRoot([]), ScreenHeaderComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ScreenHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  describe('icon', () => {
    it('should render if provided', () => {
      component.icon = 'home';
      fixture.detectChanges();

      expect(element('.icon').attributes['ng-reflect-name']).toEqual('home');
    });

    it('should not render if not provided', () => {
      component.icon = null;
      fixture.detectChanges();

      expect(element('.icon')).toBeNull();
    });
  });

  describe('screen title', () => {
    it('should render text if provided', () => {
      component.title = 'Hello World';
      fixture.detectChanges();

      expect(element('.screen-title').nativeElement.textContent.trim()).toBe(
        'Hello World',
      );
    });

    it('should render an empty string if no text is provided', () => {
      component.title = null;
      fixture.detectChanges();

      expect(element('.screen-title').nativeElement.textContent.trim()).toBe('');
    });

    it('should append an asterisk if `hasUnsavedChanges` is `true`', () => {
      component.title = 'Hello World';
      component.hasUnsavedChanges = true;
      fixture.detectChanges();

      expect(element('.screen-title').attributes['class']).toContain('end-with-asterisk');
    });
  });

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }
});
