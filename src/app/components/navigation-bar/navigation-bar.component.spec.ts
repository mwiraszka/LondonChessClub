import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { DropdownDirective } from '@app/directives';
import { query, queryTextContent } from '@app/utils';

import { NavigationBarComponent } from './navigation-bar.component';

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DropdownDirective, NavigationBarComponent, RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null),
              },
            },
            queryParamMap: of({
              get: (key: string) => (key === 'queryParam' ? 'queryValue' : null),
            }),
          },
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NavigationBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  describe('navigation links', () => {
    it('should render the correct number of links when screenWidth is above 700px', () => {
      component.screenWidth = 800;
      fixture.detectChanges();

      const renderedLinks = fixture.nativeElement.querySelectorAll('.nav-link');
      expect(renderedLinks.length).toBe(component.links.length);
    });

    it('should render the correct number of links when screenWidth is below 700px', () => {
      component.screenWidth = 600;
      fixture.detectChanges();

      const renderedLinks = fixture.nativeElement.querySelectorAll('.nav-link');
      expect(renderedLinks.length).toBe(component.links.length);
    });
  });

  describe('user settings button', () => {
    it('should always display the settings icon', () => {
      component.isDropdownOpen = true;
      fixture.detectChanges();
      expect(query(fixture.debugElement, '.user-settings-button')).not.toBeNull();

      component.isDropdownOpen = false;
      fixture.detectChanges();
      expect(query(fixture.debugElement, '.user-settings-button')).not.toBeNull();
    });

    it('should display correct dropdown icon when `isDropdownOpen` is true', () => {
      component.isDropdownOpen = true;
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.dropdown-icon')).toBe(
        'expand_more',
      );
    });

    it('should display correct dropdown icon when `isDropdownOpen` is false', () => {
      component.isDropdownOpen = false;
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.dropdown-icon')).toBe(
        'expand_less',
      );
    });
  });
});
