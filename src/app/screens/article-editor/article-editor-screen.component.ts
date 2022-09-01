import { Component } from '@angular/core';

import { ArticleEditorScreenFacade } from './article-editor-screen.facade';

@Component({
  selector: 'lcc-article-editor-screen',
  templateUrl: './article-editor-screen.component.html',
  styleUrls: ['./article-editor-screen.component.scss'],
  providers: [ArticleEditorScreenFacade],
})
export class ArticleEditorScreenComponent {
  constructor(public facade: ArticleEditorScreenFacade) {}
}
