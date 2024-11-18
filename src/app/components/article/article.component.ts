import { Component, Input } from '@angular/core';

import type { Article } from '@app/types';
import { wasEdited } from '@app/utils';

@Component({
  selector: 'lcc-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  readonly wasEdited = wasEdited;

  @Input() article?: Article;
}
