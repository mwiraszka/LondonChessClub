import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MetaAndTitleService } from '@app/services';
import { query } from '@app/utils';

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

    it('should render all grid sections', () => {
      expect(query(fixture.debugElement, '.first-visit-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.where-and-when-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.club-regulations-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.membership-fee-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.supplies-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.parking-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.ratings-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.rules-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.tournaments-section')).toBeTruthy();
      expect(query(fixture.debugElement, '.leadership-section')).toBeTruthy();
    });

    it('should render map in where-and-when section', () => {
      expect(
        query(fixture.debugElement, '.where-and-when-section lcc-club-map'),
      ).toBeTruthy();
    });
  });
});
