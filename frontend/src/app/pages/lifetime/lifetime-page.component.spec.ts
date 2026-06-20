import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaAndTitleService } from '@app/services';
import { query, queryAll } from '@app/utils';

import { LifetimePageComponent } from './lifetime-page.component';

describe('LifetimePageComponent', () => {
  let fixture: ComponentFixture<LifetimePageComponent>;
  let component: LifetimePageComponent;

  let metaAndTitleService: MetaAndTitleService;

  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifetimePageComponent],
      providers: [
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LifetimePageComponent);
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
      expect(updateTitleSpy).toHaveBeenCalledWith('Lifetime');
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('constants', () => {
    it('should have correct IMAGE_PATH', () => {
      expect(component.IMAGE_PATH).toBe('assets/lifetime-achievement-awards/');
    });

    it('should have RECIPIENTS_MAP with expected data', () => {
      expect(component.RECIPIENTS_MAP.get(2025)).toEqual([
        'Hans Jung',
        'Todd Southam',
        'John Zoccano',
      ]);
      expect(component.RECIPIENTS_MAP.get(2024)).toEqual([
        'Don Armstrong',
        'David Jackson',
        'Steve Killi',
        'Jay Zendrowski',
      ]);
      expect(component.RECIPIENTS_MAP.get(2023)).toEqual([
        'Steve Demmery',
        'Jim Kearley',
        'Gerry Litchfield',
      ]);
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render page header', () => {
      expect(query(fixture.debugElement, 'lcc-page-header')).toBeTruthy();
    });

    it('should render intro section', () => {
      expect(query(fixture.debugElement, '.intro-section')).toBeTruthy();
    });

    it('should render recipients sections for each year', () => {
      expect(queryAll(fixture.debugElement, '.recipients-section')).toHaveLength(3);
    });

    it('should render recipients for each year', () => {
      const recipients = queryAll(fixture.debugElement, '.recipient');
      const expectedTotal =
        component.RECIPIENTS_MAP.get(2025)!.length +
        component.RECIPIENTS_MAP.get(2024)!.length +
        component.RECIPIENTS_MAP.get(2023)!.length;

      expect(recipients).toHaveLength(expectedTotal);
    });
  });
});
