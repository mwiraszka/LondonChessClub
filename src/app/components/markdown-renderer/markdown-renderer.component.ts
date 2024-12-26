import { UntilDestroy } from '@ngneat/until-destroy';
import { kebabCase } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';

import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewChecked, Component, Inject, Input } from '@angular/core';

@UntilDestroy()
@Component({
  selector: 'lcc-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrl: './markdown-renderer.component.scss',
  imports: [CommonModule, MarkdownComponent],
})
export class MarkdownRendererComponent implements AfterViewChecked {
  @Input() data?: string;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngAfterViewChecked(): void {
    this.wrapMarkdownTables();
    this.addArticleAnchorIds();
  }

  private wrapMarkdownTables(): void {
    const tableElements = this._document.querySelectorAll('markdown table');

    if (tableElements) {
      tableElements.forEach(tableElement => {
        if (!Array.from(tableElement?.classList ?? []).includes('lcc-table')) {
          tableElement.classList.add('lcc-table');

          const wrapperElement = this._document.createElement('div');
          wrapperElement.classList.add('lcc-table-wrapper');
          tableElement?.parentNode?.insertBefore(wrapperElement, tableElement);
          wrapperElement.appendChild(tableElement);
        }
      });
    }
  }

  private addArticleAnchorIds(): void {
    const headerElements = this._document.querySelectorAll(
      'markdown h1, markdown h2, markdown h3, markdown h4, markdown h5, markdown h6',
    );

    if (headerElements) {
      headerElements.forEach(headerElement => {
        const headerTextContent = (
          headerElement.textContent || headerElement.innerHTML
        ).replace(/(<([^>]+)>)/gi, '');
        headerElement.setAttribute('id', kebabCase(headerTextContent));
      });
    }
  }
}
