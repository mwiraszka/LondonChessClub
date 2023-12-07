import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationInfoComponent } from './modification-info.component';

describe('ModificationInfoComponent', () => {
  let component: ModificationInfoComponent;
  let fixture: ComponentFixture<ModificationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificationInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
