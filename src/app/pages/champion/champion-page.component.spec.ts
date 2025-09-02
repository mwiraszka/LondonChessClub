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

    it('should render page header', () => {
      expect(query(fixture.debugElement, 'lcc-page-header')).toBeTruthy();
    });

    it('should render all grid sections', () => {
      expect(query(fixture.debugElement, '.trophies-photo')).toBeTruthy();
      expect(query(fixture.debugElement, '.other-photos')).toBeTruthy();
      expect(query(fixture.debugElement, '.history')).toBeTruthy();
      expect(query(fixture.debugElement, '.standard-championship')).toBeTruthy();
      expect(query(fixture.debugElement, '.other-championships')).toBeTruthy();
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
        '.speed-champions .expansion-header',
      ).triggerEventHandler('click');
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.junior-champions table')).toBeTruthy();
      expect(query(fixture.debugElement, '.active-champions table')).toBeFalsy();
      expect(query(fixture.debugElement, '.speed-champions table')).toBeTruthy();
    });
  });
});
