import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import IconsModule from '@app/icons';
import { MOCK_TOASTS } from '@app/mocks/toasts.mock';
import { ToastService } from '@app/services';
import { queryAll } from '@app/utils';

import { ToasterComponent } from './toaster.component';

describe('ToasterComponent', () => {
  let fixture: ComponentFixture<ToasterComponent>;
  let component: ToasterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconsModule, RouterModule.forRoot([]), ToasterComponent],
      providers: [ToastService],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ToasterComponent);
        component = fixture.componentInstance;
        component.toasts = MOCK_TOASTS;
        fixture.detectChanges();
      });
  });

  it('should render all toasts', () => {
    expect(queryAll(fixture.debugElement, '.toast').length).toBe(MOCK_TOASTS.length);
  });

  it('should apply correct classes and render correct content within each toast', () => {
    queryAll(fixture.debugElement, '.toast').forEach((element, i) => {
      expect(element.attributes['class']).toContain(`toast-${MOCK_TOASTS[i].type}`);

      const toastTitle = element.query(By.css('.toast-title')).nativeElement.textContent;
      expect(toastTitle).toBe(MOCK_TOASTS[i].title);

      const toastMessage = element.query(By.css('.toast-message')).nativeElement
        .textContent;
      expect(toastMessage).toBe(MOCK_TOASTS[i].message);

      const iconName = element.query(By.css('.icon')).componentInstance.name;
      expect(iconName).toBe(component.getIcon(MOCK_TOASTS[i].type));
    });
  });
});
