import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IconsModule } from '@app/icons';
import { TooltipModule } from '@app/components/tooltip';
import { RouterModule } from '@angular/router';

import { AdminControlsComponent } from './admin-controls.component';

describe('AdminControlsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconsModule, RouterModule.forRoot([]), TooltipModule],
      declarations: [AdminControlsComponent],
    }).compileComponents();
  });

  it('should render an edit button', () => {
    const fixture = TestBed.createComponent(AdminControlsComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.edit-button'))).not.toBeNull();
  });

  it('should render a delete button', () => {
    const fixture = TestBed.createComponent(AdminControlsComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.delete-button'))).not.toBeNull();
  });
});
