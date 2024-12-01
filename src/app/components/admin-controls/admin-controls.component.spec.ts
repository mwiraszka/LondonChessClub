import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { TooltipComponent } from '@app/components/tooltip/tooltip.component';
import { IconsModule } from '@app/icons';

import { AdminControlsComponent } from './admin-controls.component';

describe('AdminControlsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminControlsComponent,
        IconsModule,
        RouterModule.forRoot([]),
        TooltipComponent,
      ],
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
