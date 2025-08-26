import { ComponentFixture, TestBed } from '@angular/core/testing';

import { query, queryTextContent } from '@app/utils';

import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PageHeaderComponent);
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should always display title', () => {
      fixture.componentRef.setInput('title', 'Mock Title');
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.page-title')).toBe('Mock Title');
    });

    it('should display icon when provided', () => {
      fixture.componentRef.setInput('title', 'Mock Title');
      fixture.componentRef.setInput('icon', 'home');
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, 'mat-icon')).toBe('home');
    });

    it('should not display icon when not provided', () => {
      fixture.componentRef.setInput('title', 'Mock Title');
      fixture.componentRef.setInput('icon', null);
      fixture.detectChanges();

      expect(query(fixture.debugElement, 'mat-icon')).toBeFalsy();
    });

    it('should add end-with-asterisk class when hasUnsavedChanges is true', () => {
      fixture.componentRef.setInput('title', 'Mock Title');
      fixture.componentRef.setInput('hasUnsavedChanges', true);
      fixture.detectChanges();

      expect(
        query(fixture.debugElement, '.page-title').classes['end-with-asterisk'],
      ).toBe(true);
    });

    it('should not add end-with-asterisk class when hasUnsavedChanges is false', () => {
      fixture.componentRef.setInput('title', 'Mock Title');
      fixture.componentRef.setInput('hasUnsavedChanges', false);
      fixture.detectChanges();

      expect(
        query(fixture.debugElement, '.page-title').classes['end-with-asterisk'],
      ).toBeUndefined();
    });

    it('should not add end-with-asterisk class when hasUnsavedChanges is null', () => {
      fixture.componentRef.setInput('title', 'Mock Title');
      fixture.componentRef.setInput('hasUnsavedChanges', null);
      fixture.detectChanges();

      expect(
        query(fixture.debugElement, '.page-title').classes['end-with-asterisk'],
      ).toBeUndefined();
    });
  });
});
