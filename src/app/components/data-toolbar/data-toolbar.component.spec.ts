import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TooltipDirective } from '@app/directives/tooltip.directive';
import { MOCK_MEMBERS } from '@app/mocks/members.mock';
import { DataPaginationOptions, Member } from '@app/models';
import { query, queryAll, queryTextContent } from '@app/utils';

import { DataToolbarComponent } from './data-toolbar.component';

describe('DataToolbarComponent', () => {
  let fixture: ComponentFixture<DataToolbarComponent<Member>>;
  let component: DataToolbarComponent<Member>;

  let optionsChangeSpy: jest.SpyInstance;
  let optionsChangeNoFetchSpy: jest.SpyInstance;

  const mockOptions: DataPaginationOptions<Member> = {
    page: 3,
    pageSize: 10,
    sortBy: 'lastName',
    sortOrder: 'asc',
    filters: {},
    search: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataToolbarComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(DataToolbarComponent<Member>);
    component = fixture.componentInstance;

    optionsChangeSpy = jest.spyOn(component.optionsChange, 'emit');
    optionsChangeNoFetchSpy = jest.spyOn(component.optionsChangeNoFetch, 'emit');

    component.entity = 'member';
    component.filteredCount = MOCK_MEMBERS.length;
    component.options = { ...mockOptions };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('page change', () => {
    it('should emit correct options when changing to first page', () => {
      component.onFirstPage();

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        page: 1,
      });
    });

    it('should emit correct options when changing to previous page', () => {
      component.onPreviousPage();

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        page: 2,
      });
    });

    it('should emit correct options when changing to next page', () => {
      component.onNextPage();

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        page: 4,
      });
    });
  });

  describe('page size change', () => {
    it('should emit new page size and reset to page 1 when changed', () => {
      component.onPageSizeChange(50);

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        pageSize: 50,
        page: 1,
      });
    });

    it('should not emit when page size has not changed', () => {
      component.onPageSizeChange(10);

      expect(optionsChangeSpy).not.toHaveBeenCalled();
    });

    it('should emit no-fetch event when reducing page size while on first page', () => {
      component.options = { ...mockOptions, page: 1, pageSize: 20 };
      component.onPageSizeChange(10);

      expect(optionsChangeNoFetchSpy).toHaveBeenCalledWith({
        ...mockOptions,
        page: 1,
        pageSize: 10,
      });
    });
  });

  describe('search query change', () => {
    it('should emit new options after search query changes, but only after 300ms debounce time', fakeAsync(() => {
      const event = { target: { value: 'test' } } as unknown as Event;

      component.onSearchQueryChange(event);

      tick(299);

      expect(optionsChangeSpy).not.toHaveBeenCalled();

      tick(1);

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        search: 'test',
        page: 1,
      });
    }));
  });

  describe('filter toggling', () => {
    it('should toggle filter value when clicked', () => {
      const filter = {
        key: 'isActive',
        value: { label: 'Show active members', value: true },
      };

      component.onToggleFilter(filter);

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        page: 1,
        filters: {
          ...mockOptions.filters,
          isActive: { ...filter.value, value: !filter.value.value },
        },
      });
    });
  });

  describe('template rendering', () => {
    describe('page navigation buttons', () => {
      it('should always render page navigation buttons', () => {
        expect(query(fixture.debugElement, '.first-page-button')).toBeTruthy();
        expect(query(fixture.debugElement, '.previous-page-button')).toBeTruthy();
        expect(query(fixture.debugElement, '.next-page-button')).toBeTruthy();
        expect(query(fixture.debugElement, '.last-page-button')).toBeTruthy();
      });

      describe('with only one pages of data', () => {
        beforeEach(() => {
          fixture.componentRef.setInput('options', {
            ...mockOptions,
            page: 1,
            pageSize: 20,
          });
          fixture.componentRef.setInput('filteredCount', 20);
          fixture.detectChanges();
        });

        it('should disable all page navigation buttons', () => {
          expect(
            query(fixture.debugElement, '.first-page-button').nativeElement.disabled,
          ).toBe(true);
          expect(
            query(fixture.debugElement, '.previous-page-button').nativeElement.disabled,
          ).toBe(true);
          expect(
            query(fixture.debugElement, '.next-page-button').nativeElement.disabled,
          ).toBe(true);
          expect(
            query(fixture.debugElement, '.last-page-button').nativeElement.disabled,
          ).toBe(true);
        });
      });

      describe('when on first page with at least 2 pages of data', () => {
        beforeEach(() => {
          fixture.componentRef.setInput('options', {
            ...mockOptions,
            page: 1,
            pageSize: 10,
          });
          fixture.componentRef.setInput('filteredCount', 11);
          fixture.detectChanges();
        });

        it('should disable first and previous page buttons', () => {
          expect(
            query(fixture.debugElement, '.first-page-button').nativeElement.disabled,
          ).toBe(true);
          expect(
            query(fixture.debugElement, '.previous-page-button').nativeElement.disabled,
          ).toBe(true);
        });

        it('should keep next and last page buttons enabled', () => {
          expect(
            query(fixture.debugElement, '.next-page-button').nativeElement.disabled,
          ).toBe(false);
          expect(
            query(fixture.debugElement, '.last-page-button').nativeElement.disabled,
          ).toBe(false);
        });
      });

      describe('when on last page with at least 2 pages of data', () => {
        beforeEach(() => {
          fixture.componentRef.setInput('options', {
            ...mockOptions,
            page: 2,
            pageSize: 10,
          });
          fixture.componentRef.setInput('filteredCount', 11);
          fixture.detectChanges();
        });

        it('should keep first and previous page buttons enabled', () => {
          expect(
            query(fixture.debugElement, '.first-page-button').nativeElement.disabled,
          ).toBe(false);
          expect(
            query(fixture.debugElement, '.previous-page-button').nativeElement.disabled,
          ).toBe(false);
        });

        it('should disable next and last page buttons enabled', () => {
          expect(
            query(fixture.debugElement, '.next-page-button').nativeElement.disabled,
          ).toBe(true);
          expect(
            query(fixture.debugElement, '.last-page-button').nativeElement.disabled,
          ).toBe(true);
        });
      });
    });

    it('should render page size buttons', () => {
      const pageSizeButtons = queryAll(fixture.debugElement, '.page-size-button');

      // Add 1 to account for the ALL button at the end
      expect(pageSizeButtons.length).toBe(component.STANDARD_PAGE_SIZES.length + 1);

      pageSizeButtons.forEach((button, index) => {
        if (index < component.STANDARD_PAGE_SIZES.length) {
          expect(button.nativeElement.textContent.trim()).toBe(
            component.STANDARD_PAGE_SIZES[index].toString(),
          );
        } else {
          expect(button.nativeElement.textContent.trim()).toBe('all');
        }
      });
    });

    describe('filters', () => {
      it('should render filters section and a filter item for each ', () => {
        fixture.componentRef.setInput('options', {
          ...mockOptions,
          filters: {
            isActive: { label: 'Show active members', value: true },
          },
        });
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.filters')).toBeTruthy();
        expect(queryAll(fixture.debugElement, '.filter').length).toBe(1);
      });

      it('should not render filters section if no filters are defined', () => {
        fixture.componentRef.setInput('options', { ...mockOptions, filters: {} });
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.filters')).toBeFalsy();
        expect(queryAll(fixture.debugElement, '.filter').length).toBe(0);
      });
    });

    describe('pagination summary', () => {
      it('should summarize correctly', () => {
        fixture.componentRef.setInput('filteredCount', 99);
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.pagination-summary')).toBe(
          'Showing 21\u00A0\u2013\u00A030\u00A0\u00A0/\u00A0\u00A099 members',
        );
      });

      it('should modify summary when filteredCount is exactly 1', () => {
        fixture.componentRef.setInput('filteredCount', 1);
        fixture.componentRef.setInput('options', { ...mockOptions, page: 1 });
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.pagination-summary')).toBe(
          'Showing 1\u00A0\u2013\u00A01\u00A0\u00A0/\u00A0\u00A01 member',
        );
      });

      it('should modify summary when filteredCount is exactly 0', () => {
        fixture.componentRef.setInput('filteredCount', 0);
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.pagination-summary')).toBe(
          'No matches 😢',
        );
      });

      it('should show "No matches" when filteredCount is 0', () => {
        fixture.componentRef.setInput('filteredCount', 0);
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.pagination-summary')).toBe(
          'No matches 😢',
        );
      });

      it('should show "Loading" when filteredCount is null', () => {
        fixture.componentRef.setInput('filteredCount', null);
        fixture.detectChanges();

        expect(queryTextContent(fixture.debugElement, '.pagination-summary')).toBe(
          'Loading...',
        );
      });
    });
  });

  describe('lastPage getter', () => {
    it('should return 1 when filteredCount is 0', () => {
      component.filteredCount = 0;
      component.options = { ...mockOptions, pageSize: 10 };
      fixture.detectChanges();

      expect(component.lastPage).toBe(1);
    });

    it('should return 1 when pageSize is 0', () => {
      component.filteredCount = 50;
      component.options = { ...mockOptions, pageSize: 0 };
      fixture.detectChanges();

      expect(component.lastPage).toBe(1);
    });

    it('should calculate correctly when both values are positive', () => {
      component.filteredCount = 25;
      component.options = { ...mockOptions, pageSize: 10 };
      fixture.detectChanges();

      expect(component.lastPage).toBe(3);
    });
  });
});
