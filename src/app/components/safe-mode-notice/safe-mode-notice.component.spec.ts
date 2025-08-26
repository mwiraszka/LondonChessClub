import { ComponentFixture, TestBed } from '@angular/core/testing';

import { queryTextContent } from '@app/utils';

import { SafeModeNoticeComponent } from './safe-mode-notice.component';

describe('SafeModeNoticeComponent', () => {
  let fixture: ComponentFixture<SafeModeNoticeComponent>;
  let component: SafeModeNoticeComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SafeModeNoticeComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SafeModeNoticeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should use given entity in aside text', () => {
      fixture.componentRef.setInput('entity', 'Michal');
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, 'aside')).toContain('Michal');
    });

    it('should render a checkmark icon', () => {
      fixture.componentRef.setInput('entity', 'User');
      fixture.detectChanges();
      expect(queryTextContent(fixture.debugElement, 'mat-icon')).toBe('check_circle_outline');
    });
  });
});
