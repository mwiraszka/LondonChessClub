import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { MOCK_TOASTS } from '@app/mocks/toasts.mock';
import { ToastService } from '@app/services';
import { queryAll, queryTextContent } from '@app/utils';

import { ToasterComponent } from './toaster.component';

describe('ToasterComponent', () => {
  let fixture: ComponentFixture<ToasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), ToasterComponent],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToasterComponent);

    fixture.componentRef.setInput('toasts', MOCK_TOASTS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should render all toasts', () => {
      expect(queryAll(fixture.debugElement, '.toast').length).toBe(MOCK_TOASTS.length);
    });

    it('should apply correct classes and render correct content within each toast', () => {
      queryAll(fixture.debugElement, '.toast').forEach((element, i) => {
        expect(element.attributes['class']).toContain(`toast-${MOCK_TOASTS[i].type}`);

        expect(queryTextContent(element, 'mat-icon')).toBe(
          fixture.componentInstance.getIcon(MOCK_TOASTS[i].type),
        );
        expect(queryTextContent(element, '.title')).toBe(MOCK_TOASTS[i].title);
        expect(queryTextContent(element, '.message')).toBe(MOCK_TOASTS[i].message);
      });
    });
  });
});
