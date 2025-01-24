import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { ClubMapComponent } from './club-map.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<ClubMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClubMapComponent, RouterModule.forRoot([])],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ClubMapComponent);
      });
  });

  it('should render the club map element that hosts the Google Maps widget', () => {
    expect(fixture.debugElement.query(By.css('#club-map'))).not.toBeNull();
  });
});
