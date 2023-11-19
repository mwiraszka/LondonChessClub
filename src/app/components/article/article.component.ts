import { Component, Input } from '@angular/core';

import { Article } from '@app/types';

@Component({
  selector: 'lcc-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  @Input() article?: Article;
}
