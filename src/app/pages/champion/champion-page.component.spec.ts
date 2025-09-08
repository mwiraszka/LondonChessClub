import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MetaAndTitleService } from '@app/services';
import { query } from '@app/utils';

import { ChampionPageComponent } from './champion-page.component';

describe('ChampionPageComponent', () => {
  let fixture: ComponentFixture<ChampionPageComponent>;
  let component: ChampionPageComponent;

  let metaAndTitleService: MetaAndTitleService;
  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChampionPageComponent);
    component = fixture.componentInstance;

    metaAndTitleService = TestBed.inject(MetaAndTitleService);
    updateDescriptionSpy = jest.spyOn(metaAndTitleService, 'updateDescription');
    updateTitleSpy = jest.spyOn(metaAndTitleService, 'updateTitle');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set meta title and description', () => {
      component.ngOnInit();

      expect(updateTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTitleSpy).toHaveBeenCalledWith('City Champion');
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should always render page header and all page sections', () => {
      expect(query(fixture.debugElement, 'lcc-page-header')).toBeTruthy();
      expect(
        query(fixture.debugElement, '.history-and-photos-section .history'),
      ).toBeTruthy();
      expect(
        query(fixture.debugElement, '.history-and-photos-section lcc-photo-carousel'),
      ).toBeTruthy();
      expect(
        query(fixture.debugElement, '.past-champions-section .standard-championship'),
      ).toBeTruthy();
      expect(
        query(fixture.debugElement, '.past-champions-section .other-championships'),
      ).toBeTruthy();
    });

    it("should not render 'other championships' tables by default", () => {
      expect(query(fixture.debugElement, '.junior-champions table')).toBeFalsy();
      expect(query(fixture.debugElement, '.active-champions table')).toBeFalsy();
      expect(query(fixture.debugElement, '.speed-champions table')).toBeFalsy();
    });

    it("should render 'other championships' tables for the expanded panels", () => {
      query(
        fixture.debugElement,
        '.junior-champions .expansion-header',
      ).triggerEventHandler('click');
      query(
        fixture.debugElement,
        '.active-champions .expansion-header',
      ).triggerEventHandler('click');
      query(
        fixture.debugElement,
        '.speed-champions .expansion-header',
      ).triggerEventHandler('click');
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.junior-champions table')).toBeTruthy();
      expect(query(fixture.debugElement, '.active-champions table')).toBeTruthy();
      expect(query(fixture.debugElement, '.speed-champions table')).toBeTruthy();
    });

    it('should render standard championship table by default', () => {
      expect(query(fixture.debugElement, '.standard-championship table')).toBeTruthy();
    });
  });

  describe('expansion panel functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle junior panel expansion state', () => {
      expect(component.juniorPanelExpanded).toBe(false);

      query(
        fixture.debugElement,
        '.junior-champions .expansion-header',
      ).triggerEventHandler('click');

      expect(component.juniorPanelExpanded).toBe(true);

      query(
        fixture.debugElement,
        '.junior-champions .expansion-header',
      ).triggerEventHandler('click');

      expect(component.juniorPanelExpanded).toBe(false);
    });

    it('should toggle active panel expansion state', () => {
      expect(component.activePanelExpanded).toBe(false);

      query(
        fixture.debugElement,
        '.active-champions .expansion-header',
      ).triggerEventHandler('click');

      expect(component.activePanelExpanded).toBe(true);
    });

    it('should toggle speed panel expansion state', () => {
      expect(component.speedPanelExpanded).toBe(false);

      query(
        fixture.debugElement,
        '.speed-champions .expansion-header',
      ).triggerEventHandler('click');

      expect(component.speedPanelExpanded).toBe(true);
    });
  });

  describe('component data properties', () => {
    it('should have photos array with expected length', () => {
      expect(component.photos).toBeDefined();
      expect(component.photos.length).toBe(5);
    });

    it('should have populated championship data arrays', () => {
      expect(component.standardChampionships.length).toBeGreaterThan(0);
      expect(component.activeChampionships.length).toBeGreaterThan(0);
      expect(component.juniorChampionships.length).toBeGreaterThan(0);
      expect(component.speedChampionships.length).toBeGreaterThan(0);
    });

    it('should initialize "see full table" and expansion flags to false', () => {
      expect(component.seeFullActiveTable).toBe(false);
      expect(component.seeFullJuniorTable).toBe(false);
      expect(component.seeFullSpeedTable).toBe(false);
      expect(component.seeFullStandardTable).toBe(false);

      expect(component.activePanelExpanded).toBe(false);
      expect(component.juniorPanelExpanded).toBe(false);
      expect(component.speedPanelExpanded).toBe(false);
    });
  });
});
