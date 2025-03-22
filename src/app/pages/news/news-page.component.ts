import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-news-page',
  template: `
    <lcc-page-header
      title="News"
      icon="activity">
    </lcc-page-header>
    <lcc-article-grid></lcc-article-grid>
  `,
  imports: [ArticleGridComponent, CommonModule, PageHeaderComponent],
})
export class NewsPageComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('News');
    this.metaAndTitleService.updateDescription(
      'Read about a variety of topics related to the London Chess Club.',
    );
  }
}
