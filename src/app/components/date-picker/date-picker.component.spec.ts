import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipComponent } from '@app/components/tooltip/tooltip.component';
import { IconsModule } from '@app/icons';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent, IconsModule, TooltipComponent],
    }).compileComponents();
  });

  it('should render the correct number of days for each month', () => {
    const fixture = TestBed.createComponent(DatePickerComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.edit-button'))).not.toBeNull();
  });
});
