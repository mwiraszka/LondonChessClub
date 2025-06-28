import { ComponentFixture, TestBed } from '@angular/core/testing';

import { query, queryTextContent } from '@app/utils';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;
  let component: PageHeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PageHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should always display title', () => {
    component.title = 'Mock Title';
    fixture.detectChanges();

    expect(queryTextContent(fixture.debugElement, '.page-title')).toBe('Mock Title');
  });

  it('should display icon when provided', () => {
    component.icon = 'home';
    fixture.detectChanges();

    expect(queryTextContent(fixture.debugElement, 'mat-icon')).toBe('home');
  });

  it('should not display icon when not provided', () => {
    component.icon = null;
    fixture.detectChanges();

    expect(query(fixture.debugElement, 'mat-icon')).toBeNull();
  });

  it('should add end-with-asterisk class when hasUnsavedChanges is true', () => {
    component.title = 'Mock Title';
    component.hasUnsavedChanges = true;
    fixture.detectChanges();

    expect(query(fixture.debugElement, '.page-title').classes['end-with-asterisk']).toBe(
      true,
    );
  });

  it('should not add end-with-asterisk class when hasUnsavedChanges is false', () => {
    component.title = 'Mock Title';
    component.hasUnsavedChanges = false;
    fixture.detectChanges();

    expect(
      query(fixture.debugElement, '.page-title').classes['end-with-asterisk'],
    ).toBeUndefined();
  });

  it('should not add end-with-asterisk class when hasUnsavedChanges is null', () => {
    component.title = 'Mock Title';
    component.hasUnsavedChanges = null;
    fixture.detectChanges();

    expect(
      query(fixture.debugElement, '.page-title').classes['end-with-asterisk'],
    ).toBeUndefined();
  });
});
