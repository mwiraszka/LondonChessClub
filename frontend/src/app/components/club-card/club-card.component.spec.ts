import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LCC_CLUB, REGIONAL_CLUBS } from '@app/constants/clubs';
import { query, queryAll } from '@app/utils';

import { ClubCardComponent } from './club-card.component';

describe('ClubCardComponent', () => {
  let component: ClubCardComponent;
  let fixture: ComponentFixture<ClubCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubCardComponent);
    component = fixture.componentInstance;
    component.club = LCC_CLUB;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render club name', () => {
      const clubName = query(fixture.debugElement, '.club-name');
      expect(clubName?.nativeElement.textContent).toContain(LCC_CLUB.name);
    });

    it('should render address', () => {
      const address = query(fixture.debugElement, '.address .address');
      const addressText = address?.nativeElement.textContent;

      expect(addressText).toContain(LCC_CLUB.addressLine1);
      expect(addressText).toContain(LCC_CLUB.addressLine2);
      expect(addressText).toContain(LCC_CLUB.addressLine3);
    });

    it('should render schedule text', () => {
      const schedule = query(fixture.debugElement, '.schedule');
      expect(schedule?.nativeElement.textContent).toContain(LCC_CLUB.scheduleText);
    });

    it('should render email link when email is provided', () => {
      const emailLink = query(fixture.debugElement, '.email-link');

      expect(emailLink).toBeTruthy();
      expect(emailLink?.nativeElement.getAttribute('href')).toBe(
        `mailto:${LCC_CLUB.email}`,
      );
      expect(emailLink?.nativeElement.textContent).toContain(LCC_CLUB.email);
    });

    it('should not render email section when email is not provided', () => {
      component.club = REGIONAL_CLUBS.find(club => !club.email)!;
      fixture.detectChanges();

      const emailSection = query(fixture.debugElement, '.email');
      expect(emailSection).toBeFalsy();
    });

    it('should render club map component', () => {
      const clubMap = query(fixture.debugElement, 'lcc-club-map');
      expect(clubMap).toBeTruthy();
    });

    it('should render location icon', () => {
      const icons = queryAll(fixture.debugElement, 'mat-icon');
      const locationIcon = icons.find(
        icon => icon.nativeElement.textContent.trim() === 'location_on',
      );

      expect(locationIcon).toBeTruthy();
    });

    it('should render email icon when email exists', () => {
      const icons = queryAll(fixture.debugElement, 'mat-icon');
      const emailIcon = icons.find(
        icon => icon.nativeElement.textContent.trim() === 'email',
      );

      expect(emailIcon).toBeTruthy();
    });

    it('should render external link icon when email exists', () => {
      const icons = queryAll(fixture.debugElement, 'mat-icon');
      const externalLinkIcon = icons.find(
        icon => icon.nativeElement.textContent.trim() === 'open_in_new',
      );

      expect(externalLinkIcon).toBeTruthy();
    });
  });
});
