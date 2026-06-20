import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { DropdownDirective } from '@app/directives/dropdown.directive';
import { query, queryTextContent } from '@app/utils';

import { NavigationBarComponent } from './navigation-bar.component';

describe('NavigationBarComponent', () => {
  let fixture: ComponentFixture<NavigationBarComponent>;
  let component: NavigationBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
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
        expect(query(fixture.debugElement, '.user-settings-button')).toBeTruthy();
      });

      it('should display expand_less icon when closed', () => {
        component.isDropdownOpen = false;
        fixture.detectChanges();
        expect(queryTextContent(fixture.debugElement, '.dropdown-icon')).toBe(
          'expand_less',
        );
      });

      it('should display expand_less icon when open (state not toggled via directive)', () => {
        component.isDropdownOpen = true;
        fixture.detectChanges();
        expect(queryTextContent(fixture.debugElement, '.dropdown-icon')).toBe(
          'expand_less',
        );
      });
    });
  });
});
