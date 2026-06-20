import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/directives/tooltip.directive';
import { ExternalLink, InternalLink } from '@app/models';
import { RouterLinkPipe } from '@app/pipes';

@Component({
  selector: 'lcc-link-list',
  template: `
    @if (header) {
      <h3>{{ header }}</h3>
    }

    <ul [class.single-column]="links.length < 4">
      @for (link of links; track link) {
        <li>
          @if (link.externalPath) {
            <a
              class="lcc-link"
              [href]="link.externalPath"
              ref="noopener noreferrer"
              target="_blank"
              [tooltip]="link.tooltip ?? null">
              @if (link.icon) {
                <mat-icon class="link-icon">{{ link.icon }}</mat-icon>
              }
              <div>{{ link.text }}</div>
              <mat-icon class="external-link-icon">open_in_new</mat-icon>
            </a>
          } @else {
            <a
              class="lcc-link"
              [routerLink]="link.internalPath | routerLink"
              [tooltip]="link.tooltip ?? null">
              @if (link.icon) {
                <mat-icon>{{ link.icon }}</mat-icon>
              }
              <div>{{ link.text }}</div>
            </a>
          }
        </li>
      }
    </ul>
  `,
  styleUrl: './link-list.component.scss',
  imports: [MatIconModule, RouterLink, RouterLinkPipe, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkListComponent {
  @Input() public header?: string;
  @Input() public links: Array<InternalLink | ExternalLink> = [];
}
