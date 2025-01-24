import { MockComponent } from 'ng-mocks';

import { DebugElement } from '@angular/core';
import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { MOCK_ARTICLES } from '@app/mocks/articles.mock';

import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
  let fixture: ComponentFixture<ArticleComponent>;
  let component: ArticleComponent;

  beforeEach(() => {
    TestBed.overrideComponent(ArticleComponent, {
      remove: { imports: [MarkdownRendererComponent] },
      add: { imports: [MockComponent(MarkdownRendererComponent)] },
    });

    TestBed.configureTestingModule({
      imports: [ArticleComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ArticleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });

  describe('with article', () => {
    beforeEach(() => {
      component.article = MOCK_ARTICLES[2];
      fixture.detectChanges();
    });

    it('should render all containers', () => {
      expect(element('.banner-image-container')).not.toBeNull();
      expect(element('.article-details-container')).not.toBeNull();
      expect(element('.editor-container')).not.toBeNull();
      expect(element('.markdown-container')).not.toBeNull();
    });

    it('should render all article content elements and Markdown Renderer component', () => {
      expect(element('.title')).not.toBeNull();
      expect(element('.author-name')).not.toBeNull();
      expect(element('.date-created')).not.toBeNull();
      expect(element('.updated')).not.toBeNull();
      expect(element('.editor-name')).not.toBeNull();
      expect(element('.date-last-edited')).not.toBeNull();
      expect(element('lcc-markdown-renderer')).not.toBeNull();
    });

    it('should initially render loading placeholder image', () => {
      expect(element('.loading-placeholder-image')).not.toBeNull();
      expect(element('img')).toBeNull();
    });

    // Currently not possible to retrieve deferrable blocks due to ng-mocks bug:
    // https://github.com/help-me-mom/ng-mocks/issues/7742
    xit('should replace placeholder with image once finished loading', async () => {
      const deferBlocks = await fixture.getDeferBlocks();
      deferBlocks[0]?.render(DeferBlockState.Complete);

      expect(element('.loading-placeholder-image')).toBeNull();
      expect(element('img')).not.toBeNull();
    });

    it('should truncate article title to 120 characters', () => {
      expect(element('.title').nativeElement.textContent.trim()).toHaveLength(120);
    });

    it("should include the article author's and editor's names", () => {
      expect(element('.author-name').nativeElement.textContent.trim()).toBe(
        MOCK_ARTICLES[2].modificationInfo.createdBy,
      );

      expect(element('.editor-name').nativeElement.textContent.trim()).toBe(
        MOCK_ARTICLES[2].modificationInfo.lastEditedBy,
      );
    });

    it('should format dates correctly', () => {
      expect(element('.date-created').nativeElement.textContent.trim()).toBe(
        'Wed, Jan 1, 2025, 12:00 PM',
      );

      expect(element('.date-last-edited').nativeElement.textContent.trim()).toBe(
        'Thu, Jan 2, 2025, 10:00 AM',
      );
    });

    describe('when article creation and last edited date are on the same day', () => {
      beforeEach(() => {
        component.article = MOCK_ARTICLES[4];
        fixture.detectChanges();
      });

      it('should display article creation info but not last edit info', () => {
        expect(element('.date-created').nativeElement.textContent.trim()).toBe(
          'Mon, Jan 20, 2025, 2:00 PM',
        );
        expect(element('.date-last-edited')).toBeNull();
      });
    });

    describe('when article image URL is not available', () => {
      beforeEach(() => {
        component.article = MOCK_ARTICLES[3];
        fixture.detectChanges();
      });

      it('should keep displaying loading placeholder image', async () => {
        expect(element('.banner-image')).toBeNull();
        expect(element('.loading-placeholder-image')).not.toBeNull();

        const deferBlocks = await fixture.getDeferBlocks();
        deferBlocks[0]?.render(DeferBlockState.Complete);

        expect(element('.banner-image')).toBeNull();
        expect(element('.loading-placeholder-image')).not.toBeNull();
      });
    });
  });

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }
});
