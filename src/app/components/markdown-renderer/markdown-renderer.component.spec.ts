import { MockComponent } from 'ng-mocks';
import { MarkdownComponent } from 'ngx-markdown';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  RouterLink,
  RouterModule,
  convertToParamMap,
} from '@angular/router';

import { RouteFragmentService } from '@app/services';
import { query, queryAll } from '@app/utils';

import { MarkdownRendererComponent } from './markdown-renderer.component';

describe('MarkdownRendererComponent', () => {
  let fixture: ComponentFixture<MarkdownRendererComponent>;
  let component: MarkdownRendererComponent;

  let wrapMarkdownTablesSpy: jest.SpyInstance;
  let addBlockquoteIconsSpy: jest.SpyInstance;
  let addAnchorIdsToHeadingsSpy: jest.SpyInstance;
  let scrollToAnchorSpy: jest.SpyInstance;

  const mockMarkdownText = `
  ## Heading 1
  
  Some text here.
  
  ## Heading 2
  
  More text here.
  
  | Column 1 | Column 2 |
  |----------|----------|
  | Data 1   | Data 2   |
  
  > This is a blockquote
  `;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownRendererComponent, RouterLink, RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('mock-fragment'),
            paramMap: of(convertToParamMap({})),
          },
        },
        {
          provide: RouteFragmentService,
          useValue: { fragment$: of('mock-fragment') },
        },
      ],
    })
      .overrideComponent(MarkdownRendererComponent, {
        remove: { imports: [MarkdownComponent] },
        add: { imports: [MockComponent(MarkdownComponent)] },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MarkdownRendererComponent);
        component = fixture.componentInstance;

        // @ts-expect-error Private class member
        scrollToAnchorSpy = jest.spyOn(component, 'scrollToAnchor');
        // @ts-expect-error Private class member
        wrapMarkdownTablesSpy = jest.spyOn(component, 'wrapMarkdownTables');
        // @ts-expect-error Private class member
        addBlockquoteIconsSpy = jest.spyOn(component, 'addBlockquoteIcons');
        // @ts-expect-error Private class member
        addAnchorIdsToHeadingsSpy = jest.spyOn(component, 'addAnchorIdsToHeadings');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentPath from document location (JSDOM location for this test)', () => {
    expect(component.currentPath).toBe('/');
  });

  it('should scroll to URL fragment after view init', () => {
    jest.useFakeTimers();

    component.ngAfterViewInit();

    jest.advanceTimersByTime(1);

    expect(scrollToAnchorSpy).toHaveBeenCalledWith('mock-fragment');

    jest.useRealTimers();
  });

  describe('when markdown data changes', () => {
    beforeAll(() => jest.useFakeTimers());
    afterAll(() => jest.useRealTimers());

    beforeEach(() => {
      component.data = mockMarkdownText;
      fixture.detectChanges();

      component.ngOnChanges({
        data: {
          currentValue: mockMarkdownText,
          previousValue: '',
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      jest.advanceTimersByTime(1);
    });

    it('should pass data to markdown component', () => {
      expect(query(fixture.debugElement, 'markdown').componentInstance.data).toBe(
        mockMarkdownText,
      );
    });

    it('should add custom blockquote and table styles, and add anchor ids to headings', () => {
      expect(addBlockquoteIconsSpy).toHaveBeenCalledTimes(1);
      expect(wrapMarkdownTablesSpy).toHaveBeenCalledTimes(1);
      expect(addAnchorIdsToHeadingsSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should create a table of contents link for each heading', () => {
    component.headings = ['Heading 1', 'Heading 2', 'Heading 3'];
    fixture.detectChanges();

    const headingLinks = queryAll(
      fixture.debugElement,
      '.table-of-contents .heading-link',
    );

    expect(headingLinks.length).toBe(3);
    expect(headingLinks[0].nativeElement.textContent.trim()).toBe('Heading 1');
    expect(headingLinks[1].nativeElement.textContent.trim()).toBe('Heading 2');
    expect(headingLinks[2].nativeElement.textContent.trim()).toBe('Heading 3');
  });
});
