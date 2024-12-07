import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';
import type { Link } from '@app/types';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  imports: [CommonModule, IconsModule, RouterLink, TooltipDirective],
})
export class LinkListComponent {
  @Input() header?: string;
  @Input() links?: Link[];
}
