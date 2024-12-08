import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-news-screen',
  templateUrl: './news-screen.component.html',
  styleUrls: ['./news-screen.component.scss'],
  imports: [ArticleGridComponent, CommonModule, ScreenHeaderComponent],
})
export class NewsScreenComponent implements OnInit {
  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('News');
    this.metaAndTitleService.updateDescription(
      'Read about a variety of topics related to the London Chess Club.',
    );
  }
}
