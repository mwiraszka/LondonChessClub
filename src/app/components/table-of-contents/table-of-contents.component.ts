import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, first } from 'rxjs/operators';

import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';

import { KebabCasePipe } from '@app/pipes/kebab-case.pipe';

@UntilDestroy()
@Component({
  selector: 'lcc-table-of-contents',
  template: `
    @for (subheading of subheadings; track subheading) {
      <a
        class="subheading-link lcc-link"
        [routerLink]="currentPath"
        [fragment]="subheading | kebabCase">
        {{ subheading }}
      </a>
    }
  `,
  styles: `
    :host {
      display: block;
      text-align: center;

      .subheading-link {
        display: inline-block;
        font-size: 18px;
        padding: 0 16px;
      }
    }
  `,
  imports: [CommonModule, KebabCasePipe, RouterLink],
})
export class TableOfContentsComponent implements AfterViewInit {
  @Input({ required: true }) subheadings!: string[];

  public currentFragment: string | null = null;
  public currentPath: string;

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.currentPath = this._document.location.pathname;
  }

  ngAfterViewInit(): void {
    // Scroll on initial load
    this.activatedRoute.fragment
      .pipe(first())
      .subscribe(fragment => this.scrollToSubheading(fragment));

    // Scroll when subheading link is clicked (will still scroll even if fragment hasn't changed)
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(event => this.scrollToSubheading(event.url.split('#')[1]));
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
