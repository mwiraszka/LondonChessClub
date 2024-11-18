import { Component, Input } from '@angular/core';

import type { Article } from '@app/types';

@Component({
  selector: 'lcc-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  readonly FIVE_MINUTES_MS = 300_000;

  @Input() article?: Article;

  wasEdited(article?: Article): boolean {
    if (!article || !article.modificationInfo) {
      return false;
    }

    return (
      article.modificationInfo.dateLastEdited.getTime() -
        article.modificationInfo.dateCreated.getTime() >
      this.FIVE_MINUTES_MS
    );
  }
}
