import { Component, Input } from '@angular/core';

import { Article } from '@app/types';
import { formatDate } from '@app/utils';

@Component({
  selector: 'lcc-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  formatDate = formatDate;

  @Input() article?: Article;
}
