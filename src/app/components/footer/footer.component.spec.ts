import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { query, queryAll, queryTextContent } from '@app/utils';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let component: FooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        RouterModule.forRoot([]),
        MatIconModule,
        ImagePreloadDirective,
        TooltipDirective,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('footer structure', () => {
    it('should render the main section', () => {
      expect(query(fixture.debugElement, '.main-section')).not.toBeNull();
    });

    it('should render the branding and socials section', () => {
      expect(query(fixture.debugElement, '.branding-and-socials')).not.toBeNull();
    });

    it('should render the site links section', () => {
      expect(query(fixture.debugElement, '.site-links')).not.toBeNull();
    });

    it('should render the copyright notice section', () => {
      expect(query(fixture.debugElement, '.copyright-notice')).not.toBeNull();
    });
  });

  describe('club logo and name', () => {
    it('should display the club logo', () => {
      expect(query(fixture.debugElement, '.logo img')).not.toBeNull();
    });

    it('should display the club name and current app version', () => {
      component.CURRENT_VERSION = '1.2.3';
      fixture.detectChanges();

      const clubNameText = queryTextContent(fixture.debugElement, '.club-name');

      expect(clubNameText).toContain('London Chess Club');
      expect(clubNameText).toContain('v1.2.3');
    });
  });

  describe('social links', () => {
    it('should render all social media links', () => {
      const socialLinks = queryAll(fixture.debugElement, '.socials a');
      expect(socialLinks.length).toBe(4);
    });

    it('should properly render WhatsApp link', () => {
      const whatsappLink = query(fixture.debugElement, '.socials .whatsapp');

      expect(whatsappLink.nativeElement.href).toContain('bit.ly/LCC-NoticeBoard');
      expect(whatsappLink.nativeElement.target).toBe('_blank');
      expect(whatsappLink.injector.get(TooltipDirective).tooltip).toBe(
        'Club noticeboard on WhatsApp',
      );
    });

    it('should properly render Instagram link', () => {
      const instagramLink = query(fixture.debugElement, '.socials .instagram');

      expect(instagramLink.nativeElement.href).toContain(
        'instagram.com/londonchessclub_',
      );
      expect(instagramLink.nativeElement.target).toBe('_blank');
      expect(instagramLink.injector.get(TooltipDirective).tooltip).toBe(
        'Follow us on Instagram',
      );
    });

    it('should properly render Chess.com link', () => {
      const chesscomLink = query(fixture.debugElement, '.socials .chesscom');

      expect(chesscomLink.nativeElement.href).toContain(
        'chess.com/club/london-chess-club-canada',
      );
      expect(chesscomLink.nativeElement.target).toBe('_blank');
      expect(chesscomLink.injector.get(TooltipDirective).tooltip).not.toBeNull();
    });

    it('should properly render email link', () => {
      const emailLink = query(fixture.debugElement, '.socials .email');

      expect(emailLink.nativeElement.href).toContain('mailto:welcome@londonchess.ca');
      expect(emailLink.nativeElement.target).toBe('_blank');
      expect(emailLink.injector.get(TooltipDirective).tooltip).not.toBeNull();
    });
  });

  describe('site links', () => {
    it('should render correct number of sections and correct header in each one', () => {
      const sections = queryAll(fixture.debugElement, '.site-links section');
      expect(sections.length).toBe(5);

      const sectionHeaders = sections.map(section => queryTextContent(section, 'header'));

      expect(sectionHeaders[0]).toBe('ABOUT US');
      expect(sectionHeaders[1]).toBe('CLUB EVENTS');
      expect(sectionHeaders[2]).toBe('ARCHIVES');
      expect(sectionHeaders[3]).toBe('DOCUMENTS');
      expect(sectionHeaders[4]).toBe('WEBSITE');
    });

    it('should render correct number of links in each section', () => {
      const aboutLinks = queryAll(fixture.debugElement, '.about-us a');
      const eventsLinks = queryAll(fixture.debugElement, '.club-events a');
      const archivesLinks = queryAll(fixture.debugElement, '.archives a');
      const documentsLinks = queryAll(fixture.debugElement, '.documents a');
      const websiteLinks = queryAll(fixture.debugElement, '.website a');

      expect(aboutLinks.length).toBe(4);
      expect(eventsLinks.length).toBe(2);
      expect(archivesLinks.length).toBe(2);
      expect(documentsLinks.length).toBe(3);
      expect(websiteLinks.length).toBe(2);
    });

    it('should have correct router links for document links', () => {
      expect(
        queryTextContent(fixture.debugElement, 'a[fragment="lcc-code-of-conduct.pdf"]'),
      ).toBe('Code of Conduct');

      expect(queryTextContent(fixture.debugElement, 'a[fragment="lcc-bylaws.pdf"]')).toBe(
        'Club Bylaws',
      );

      expect(
        queryTextContent(
          fixture.debugElement,
          'a[fragment="lcc-membership-fees-2025-to-2028.pdf"]',
        ),
      ).toBe('Membership Fees');
    });
  });

  describe('copyright notice', () => {
    it('should contain the correct text and include the current year', () => {
      component.CURRENT_YEAR = 2088;
      fixture.detectChanges();

      const copyrightNoticeText = queryTextContent(
        fixture.debugElement,
        '.copyright-notice',
      );

      expect(copyrightNoticeText).toContain('Copyright © 2088 London Chess Club');
      expect(copyrightNoticeText).toContain('All Rights Reserved.');
    });
  });
});
