import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { formatDate, query, queryTextContent } from '@app/utils';

import { UpcomingEventBannerComponent } from './upcoming-event-banner.component';

@Component({
  template: '',
})
class ScheduleStubComponent {}

describe('UpcomingEventBannerComponent', () => {
  let fixture: ComponentFixture<UpcomingEventBannerComponent>;
  let component: UpcomingEventBannerComponent;

  let clearBannerSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UpcomingEventBannerComponent],
      providers: [
        provideRouter([{ path: 'schedule', component: ScheduleStubComponent }]),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UpcomingEventBannerComponent);
        component = fixture.componentInstance;

        component.nextEvent = MOCK_EVENTS[0];

        clearBannerSpy = jest.spyOn(component.clearBanner, 'emit');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    describe('banner message', () => {
      it('should contain the title and date of the next event', () => {
        const bannerText = queryTextContent(fixture.debugElement, '.banner-message');

        expect(bannerText).toContain(MOCK_EVENTS[0].title);
        expect(bannerText).toContain(formatDate(MOCK_EVENTS[0].eventDate, 'short'));
      });

      it('should emit clearBanner when clicked', () => {
        query(fixture.debugElement, '.banner-message').nativeElement.dispatchEvent(
          new MouseEvent('click'),
        );
        fixture.detectChanges();

        expect(clearBannerSpy).toHaveBeenCalledTimes(1);
      });

      it('should have router link set to the schedule page', () => {
        expect(
          query(fixture.debugElement, '.banner-message').attributes['routerLink'],
        ).toBe('/schedule');
      });
    });

    describe('close button', () => {
      it('should display a close icon', () => {
        expect(query(fixture.debugElement, 'mat-icon')).not.toBeNull();
      });

      it('should emit a clear banner event when clicked', () => {
        query(fixture.debugElement, '.close-button').nativeElement.dispatchEvent(
          new MouseEvent('click'),
        );
        fixture.detectChanges();

        expect(clearBannerSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
