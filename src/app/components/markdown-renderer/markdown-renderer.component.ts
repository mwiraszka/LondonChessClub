import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, Component, Inject, Input } from '@angular/core';

@Component({
  selector: 'lcc-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
})
export class MarkdownRendererComponent implements AfterViewChecked {
  @Input() data?: string;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngAfterViewChecked(): void {
    this.wrapMarkdownTables();
  }

  private wrapMarkdownTables(): void {
    const tableElements = this._document.querySelectorAll('markdown table');

    if (tableElements) {
      tableElements.forEach(tableElement => {
        if (
          !Array.from(tableElement?.parentElement?.classList ?? []).includes(
            'lcc-markdown-table-wrapper',
          )
        ) {
          const wrapperElement = this._document.createElement('div');
          wrapperElement.classList.add('lcc-markdown-table-wrapper');
          tableElement?.parentNode?.insertBefore(wrapperElement, tableElement);
          wrapperElement.appendChild(tableElement);
        }
      });
    }
  }
}
