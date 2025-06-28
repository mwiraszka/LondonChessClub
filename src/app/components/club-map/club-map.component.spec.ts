import { ComponentFixture, TestBed } from '@angular/core/testing';

import { query } from '@app/utils';

import { ClubMapComponent } from './club-map.component';

describe('ClubMapComponent', () => {
  let component: ClubMapComponent;
  let fixture: ComponentFixture<ClubMapComponent>;
  let initMapSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClubMapComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ClubMapComponent);
        component = fixture.componentInstance;

        // @ts-expect-error Private class member
        initMapSpy = jest.spyOn(component, 'initMap');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should render the club map element that hosts the Google Maps widget', () => {
      expect(query(fixture.debugElement, '#club-map')).not.toBeNull();
    });

    it('should set the map options correctly', () => {
      // @ts-expect-error Private class member
      const mapOptions = component.mapOptions;

      expect(mapOptions.center).toEqual({ lat: 42.982546, lng: -81.261387 });
      expect(mapOptions.mapId).toBe('club-map');
      expect(mapOptions.mapTypeControl).toBe(false);
      expect(mapOptions.zoom).toBe(15);
    });

    it('should call initMap', () => {
      expect(initMapSpy).toHaveBeenCalledTimes(1);
    });
  });
});
