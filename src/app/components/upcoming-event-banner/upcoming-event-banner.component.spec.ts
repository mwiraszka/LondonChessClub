import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { formatDate } from '@app/utils';

import { UpcomingEventBannerComponent } from './upcoming-event-banner.component';

describe('UpcomingEventBannerComponent', () => {
  let fixture: ComponentFixture<UpcomingEventBannerComponent>;
  let component: UpcomingEventBannerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UpcomingEventBannerComponent, RouterModule.forRoot([])],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UpcomingEventBannerComponent);
        component = fixture.componentInstance;
        component.nextEvent = MOCK_EVENTS[0];
        fixture.detectChanges();
      });
  });

  describe('banner message', () => {
    it('should contain the title of the next event', () => {
      expect(element('.banner-message').nativeElement.textContent.trim()).toContain(
        MOCK_EVENTS[0].title,
      );
    });

    it('should contain the date of the next event', () => {
      const formattedEventDate = formatDate(MOCK_EVENTS[0].eventDate, 'short');
      expect(element('.banner-message').nativeElement.textContent.trim()).toContain(
        formattedEventDate,
      );
    });

    it('should emit `clearButton` event when clicked', () => {
      const clearBannerSpy = jest.spyOn(component.clearBanner, 'emit');

      // TODO: triggerEventHandler works but results in an error - simulate click event another way
      element('.banner-message').triggerEventHandler('click');

      expect(clearBannerSpy).toHaveBeenCalledTimes(1);
    });

    it('should link to the Schedule page', () => {
      expect(element('.banner-message').attributes['routerLink']).toBe('/schedule');
    });
  });

  describe('close button', () => {
    it('should emit `clearButton` event when clicked', () => {
      const clearBannerSpy = jest.spyOn(component.clearBanner, 'emit');

      element('.close-button').triggerEventHandler('click');

      expect(clearBannerSpy).toHaveBeenCalledTimes(1);
    });
  });

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }
});
