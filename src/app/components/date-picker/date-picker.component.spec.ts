import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;
  let renderCalendarMock: ReturnType<jest.Mock>;

  beforeEach(() => {
    renderCalendarMock = {
      renderCalendar: jest.fn(() => {}),
    };

    TestBed.configureTestingModule({
      imports: [DatePickerComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DatePickerComponent);
        component = fixture.componentInstance;
      });
  });

  it('should render previous month button', () => {
    expect(fixture.debugElement.query(By.css('.previous-month-button'))).not.toBeNull();
  });

  it('should render next month button', () => {
    expect(fixture.debugElement.query(By.css('.next-month-button'))).not.toBeNull();
  });
});
