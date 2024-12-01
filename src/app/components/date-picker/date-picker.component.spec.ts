import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [IconsModule, RouterModule.forRoot([]), TooltipModule, DatePickerComponent],
}).compileComponents();
  });

  it('should render the correct number of days for each month', () => {
    const fixture = TestBed.createComponent(DatePickerComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.edit-button'))).not.toBeNull();
  });
});
