import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AdminControlsComponent } from './admin-controls.component';

describe('AdminControlsComponent', () => {
  let fixture: ComponentFixture<AdminControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminControlsComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminControlsComponent);
    fixture.detectChanges();
  });

  it('should render edit button', () => {
    expect(fixture.debugElement.query(By.css('.edit-button'))).not.toBeNull();
  });

  it('should render delete button', () => {
    expect(fixture.debugElement.query(By.css('.delete-button'))).not.toBeNull();
  });
});
