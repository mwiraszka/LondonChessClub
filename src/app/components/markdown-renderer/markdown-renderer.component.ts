import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { kebabCase } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';
import { filter, first } from 'rxjs/operators';

import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';

import { KebabCasePipe } from '@app/pipes';

@UntilDestroy()
@Component({
  selector: 'lcc-markdown-renderer',
  template: `
    <div class="table-of-contents">
      @for (subheading of subheadings; track subheading) {
        <a
          class="subheading-link lcc-link"
          [routerLink]="currentPath"
          [fragment]="subheading | kebabCase">
          {{ subheading }}
        </a>
      }
    </div>
    <markdown [data]="data"></markdown>
  `,
  styleUrl: './markdown-renderer.component.scss',
  imports: [CommonModule, KebabCasePipe, MarkdownComponent, RouterLink],
})
export class MarkdownRendererComponent implements AfterViewInit, OnChanges {
  @Input() public data?: string;

  public currentFragment: string | null = null;
  public currentPath: string;
  public subheadings: string[] = [];

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.currentPath = this._document.location.pathname;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      setTimeout(() => {
        this.wrapMarkdownTables();
        this.addAnchorIdsToSubheadings();
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // Scroll on initial load
      this.activatedRoute.fragment
        .pipe(first())
        .subscribe(fragment => this.scrollToSubheading(fragment));
    });

    // Scroll when subheading link is clicked (will still scroll even if fragment hasn't changed)
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(event => this.scrollToSubheading(event.url.split('#')[1]));
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

  private addAnchorIdsToSubheadings(): void {
    const subheadingElements = this._document.querySelectorAll('markdown h2');

    const newSubheadings: string[] = [];

    if (subheadingElements) {
      subheadingElements.forEach(element => {
        const subheading = (element.textContent || element.innerHTML).replace(
          /(<([^>]+)>)/gi,
          '',
        );

        element.setAttribute('id', kebabCase(subheading));
        newSubheadings.push(subheading);
      });
    }

    this.subheadings = newSubheadings;
  }

  private scrollToSubheading(fragment?: string | null): void {
    if (!fragment) {
      return;
    }

    const subheadingElement = this._document.getElementById(fragment);

    if (subheadingElement) {
      subheadingElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
