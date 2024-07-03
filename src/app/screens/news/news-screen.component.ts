import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-news-screen',
  templateUrl: './news-screen.component.html',
  styleUrls: ['./news-screen.component.scss'],
})
export class NewsScreenComponent implements OnInit {
  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('News');
    this.metaAndTitleService.updateDescription(
      'Read about a variety of topics related to the London Chess Club.'
    );
  }
}
