import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MetaAndTitleService } from '@app/services';
import { query, queryAll } from '@app/utils';

import { AboutPageComponent } from './about-page.component';

describe('AboutPageComponent', () => {
  let fixture: ComponentFixture<AboutPageComponent>;
  let component: AboutPageComponent;

  let metaAndTitleService: MetaAndTitleService;

  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageComponent],
      providers: [
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPageComponent);
    component = fixture.componentInstance;

    metaAndTitleService = TestBed.inject(MetaAndTitleService);

    updateDescriptionSpy = jest.spyOn(metaAndTitleService, 'updateDescription');
    updateTitleSpy = jest.spyOn(metaAndTitleService, 'updateTitle');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should set meta title and description', () => {
      component.ngOnInit();

      expect(updateTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTitleSpy).toHaveBeenCalledWith('About');
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render page header', () => {
      expect(query(fixture.debugElement, 'lcc-page-header')).toBeTruthy();
    });

    it('should render all sections as expansion panels', () => {
      const expectedHeadings = [
        '📍 Location and schedule',
        '👋 First visit',
        '🚗 Parking',
        '📜 Club regulations',
        '💵 Membership fee',
        '🔢 Chess ratings',
        '♟ Chess supplies',
        '📖 Rules of the game',
        '🏆 Tournaments',
        '🗳 AGM and leadership team',
      ];

      const panels = queryAll(fixture.debugElement, 'lcc-expansion-panel');
      expect(panels.length).toBe(expectedHeadings.length);

      expectedHeadings.forEach((heading, index) => {
        expect(panels[index].componentInstance.heading).toBe(heading);
      });
    });

    it('should toggle expansion panel content when clicked', () => {
      const firstSection = query(fixture.debugElement, 'lcc-expansion-panel');
      const header = query(firstSection, '.expansion-header');

      expect(query(firstSection, '.expansion-content')).toBeFalsy();

      header.triggerEventHandler('click');
      fixture.detectChanges();

      expect(query(firstSection, '.expansion-content')).toBeTruthy();

      header.triggerEventHandler('click');
      fixture.detectChanges();

      expect(query(firstSection, '.expansion-content')).toBeFalsy();
    });
  });
});
