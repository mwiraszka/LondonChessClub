import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Input } from '@angular/core';

@Component({
  selector: 'lcc-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
})
export class MarkdownRendererComponent {
  @Input() data?: string;

  // Must match $lcc-width--app-content value set in _variables.scss
  @Input() containerMaxWidth = 1500;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngAfterViewInit(): void {
    this.wrapMarkdownTables();
    this.setMarkdownTableWidths();
  }

  /**
   * For any table in the article body (generated using markdown), manually set the table
   * width based on the screen width, and taking into account all containers' padding.
   * This is a hack to allow the table to overflow with a scrollbar within its flex container.
   **/
  @HostListener('window:resize', ['$event'])
  setMarkdownTableWidths(): void {
    const tableWrapperElements = this._document.querySelectorAll(
      '.lcc-markdown-table-wrapper',
    ) as NodeListOf<HTMLElement>;

    if (tableWrapperElements) {
      tableWrapperElements.forEach(tableWrapperElement => {
        const articleBodyContainerWidth =
          Math.min(window.innerWidth, this.containerMaxWidth) - (8 + 16) * 2;
        tableWrapperElement.style.width = `${articleBodyContainerWidth}px`;
      });
    }
  }

  private wrapMarkdownTables(): void {
    const tableElements = this._document.querySelectorAll('markdown table');

    if (tableElements) {
      tableElements.forEach(tableElement => {
        const wrapperElement = this._document.createElement('div');
        wrapperElement.classList.add('lcc-markdown-table-wrapper');
        tableElement?.parentNode?.insertBefore(wrapperElement, tableElement);
        wrapperElement.appendChild(tableElement);
      });
    }
  }
}
