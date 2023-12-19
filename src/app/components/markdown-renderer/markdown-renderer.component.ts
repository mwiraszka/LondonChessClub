import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, Component, HostListener, Inject, Input } from '@angular/core';

@Component({
  selector: 'lcc-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
})
export class MarkdownRendererComponent implements AfterViewChecked {
  @Input() data?: string;

  // Must match $lcc-width--app-content value set in _variables.scss
  @Input() containerMaxWidth = 1500;
  @Input() screen: 'viewer' | 'editor' = 'viewer';

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngAfterViewChecked(): void {
    this.wrapMarkdownTables();
    this.setMarkdownTableWidths();
  }

  /**
   * For any table in the article body (generated using markdown), manually set the table width
   * based on the screen width, and taking into account all containers' paddings at all breakpoints.
   * This is a hack to allow the table to overflow with a scrollbar within its flex container.
   **/
  @HostListener('window:resize', ['$event'])
  setMarkdownTableWidths(): void {
    const tableWrapperElements = this._document.querySelectorAll(
      '.lcc-markdown-table-wrapper',
    ) as NodeListOf<HTMLElement>;

    if (tableWrapperElements) {
      tableWrapperElements.forEach(tableWrapperElement => {
        let wrapperWidth: number;

        if (this.screen === 'viewer') {
          wrapperWidth = Math.min(window.innerWidth, this.containerMaxWidth) - 16 - 2;
        } else {
          switch (true) {
            case window.innerWidth < 500:
              wrapperWidth = window.innerWidth - 32 - 16 - 2;
              break;
            case window.innerWidth < 700:
              wrapperWidth = window.innerWidth - 32 - 16 - 2 - 16;
              break;
            case window.innerWidth < this.containerMaxWidth:
              wrapperWidth = window.innerWidth - 32 - 16 - 2 - 16 - 64 - 32;
              break;
            default:
              wrapperWidth = this.containerMaxWidth - 32 - 16 - 2 - 16 - 64 - 16;
          }
        }

        tableWrapperElement.style.width = `${wrapperWidth}px`;
      });
    }
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
