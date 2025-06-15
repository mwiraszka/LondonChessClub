import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/directives/tooltip.directive';
import type { ExternalLink, InternalLink } from '@app/models';
import { RouterLinkPipe } from '@app/pipes';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrl: './link-list.component.scss',
  imports: [MatIconModule, RouterLink, RouterLinkPipe, TooltipDirective],
})
export class LinkListComponent {
  @Input() header?: string;
  @Input() links: Array<InternalLink | ExternalLink> = [];
}
