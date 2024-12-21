import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-news-screen',
  template: `
    <lcc-screen-header
      title="News"
      icon="activity">
    </lcc-screen-header>
    <lcc-article-grid></lcc-article-grid>
  `,
  imports: [ArticleGridComponent, CommonModule, ScreenHeaderComponent],
})
export class NewsScreenComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('News');
    this.metaAndTitleService.updateDescription(
      'Read about a variety of topics related to the London Chess Club.',
    );
  }
}
