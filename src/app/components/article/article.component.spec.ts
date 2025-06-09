import { MockComponent } from 'ng-mocks';

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { MOCK_ARTICLES } from '@app/mocks/articles.mock';
import { MOCK_IMAGES } from '@app/mocks/images.mock';

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

    it('should render an image element with the banner image', () => {
      expect(element('img')).not.toBeNull();
    });

    it('should truncate article title to 120 characters', () => {
      expect(elementTextContent('.title')).toHaveLength(120);
    });

    it("should include the article author's and editor's names", () => {
      expect(elementTextContent('.author-name')).toBe(
        MOCK_ARTICLES[2].modificationInfo.createdBy,
      );

      expect(elementTextContent('.editor-name')).toBe(
        MOCK_ARTICLES[2].modificationInfo.lastEditedBy,
      );
    });

    it('should format dates correctly', () => {
      expect(elementTextContent('.date-created')).toBe('Wed, Jan 1, 2025, 12:00 PM');
      expect(elementTextContent('.date-last-edited')).toBe('Thu, Jan 2, 2025, 10:00 AM');
    });

    describe('when article creation and last edited date are on the same day', () => {
      beforeEach(() => {
        component.article = MOCK_ARTICLES[4];
        fixture.detectChanges();
      });

      it('should display article creation info but not last edit info', () => {
        expect(elementTextContent('.date-created')).toBe('Thu, Jan 2, 2025, 12:00 PM');
        expect(element('.date-last-edited')).toBeNull();
      });
    });

    describe('when article image URL is not available', () => {
      beforeEach(() => {
        component.article = MOCK_ARTICLES[3];
        component.bannerImage = null;
        fixture.detectChanges();
      });

      it('should still render the image element', () => {
        expect(element('img')).not.toBeNull();
      });
    });
  });

  function element(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  function elementTextContent(selector: string): string {
    return element(selector).nativeElement.textContent.trim();
  }
});
