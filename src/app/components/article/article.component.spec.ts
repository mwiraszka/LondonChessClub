import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { MOCK_ARTICLES } from '@app/mocks/articles.mock';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { query, queryTextContent } from '@app/utils';

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
      component.bannerImage = MOCK_IMAGES[0];
      fixture.detectChanges();
    });

    it('should render all containers', () => {
      expect(query(fixture.debugElement, '.banner-image-container')).not.toBeNull();
      expect(query(fixture.debugElement, '.article-details-container')).not.toBeNull();
      expect(query(fixture.debugElement, '.editor-container')).not.toBeNull();
      expect(query(fixture.debugElement, '.markdown-container')).not.toBeNull();
    });

    it('should render all article content elements and Markdown Renderer component', () => {
      expect(query(fixture.debugElement, '.title')).not.toBeNull();
      expect(query(fixture.debugElement, '.author-name')).not.toBeNull();
      expect(query(fixture.debugElement, '.date-created')).not.toBeNull();
      expect(query(fixture.debugElement, '.updated')).not.toBeNull();
      expect(query(fixture.debugElement, '.editor-name')).not.toBeNull();
      expect(query(fixture.debugElement, '.date-last-edited')).not.toBeNull();
      expect(query(fixture.debugElement, 'lcc-markdown-renderer')).not.toBeNull();
    });

    it('should render an image element with the banner image', () => {
      expect(query(fixture.debugElement, 'img')).not.toBeNull();
    });

    it('should truncate article title to 120 characters', () => {
      expect(queryTextContent(fixture.debugElement, '.title')).toHaveLength(120);
    });

    it("should include the article author's and editor's names", () => {
      expect(queryTextContent(fixture.debugElement, '.author-name')).toBe(
        MOCK_ARTICLES[2].modificationInfo.createdBy,
      );

      expect(queryTextContent(fixture.debugElement, '.editor-name')).toBe(
        MOCK_ARTICLES[2].modificationInfo.lastEditedBy,
      );
    });

    it('should format dates correctly', () => {
      expect(queryTextContent(fixture.debugElement, '.date-created')).toBe(
        'Wed, Jan 1, 2025, 12:00 PM',
      );
      expect(queryTextContent(fixture.debugElement, '.date-last-edited')).toBe(
        'Thu, Jan 2, 2025, 10:00 AM',
      );
    });

    describe('when article creation and last edited date are on the same day', () => {
      beforeEach(() => {
        component.article = MOCK_ARTICLES[4];
        fixture.detectChanges();
      });

      it('should display article creation info but not last edit info', () => {
        expect(queryTextContent(fixture.debugElement, '.date-created')).toBe(
          'Thu, Jan 2, 2025, 12:00 PM',
        );
        expect(query(fixture.debugElement, '.date-last-edited')).toBeNull();
      });
    });

    describe('when article image URL is not available', () => {
      beforeEach(() => {
        component.article = MOCK_ARTICLES[3];
        component.bannerImage = null;
        fixture.detectChanges();
      });

      it('should still render the image element', () => {
        expect(query(fixture.debugElement, 'img')).not.toBeNull();
      });
    });
  });
});
