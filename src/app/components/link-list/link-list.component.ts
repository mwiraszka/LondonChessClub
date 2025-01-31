import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import type { ExternalLink, InternalLink } from '@app/models';
import { RouterLinkPipe } from '@app/pipes';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrl: './link-list.component.scss',
  imports: [CommonModule, IconsModule, RouterLink, RouterLinkPipe, TooltipDirective],
})
export class LinkListComponent {
  @Input() header?: string;
  @Input() links: Array<InternalLink | ExternalLink> = [];
}
