import { Component, Input } from '@angular/core';

import type { Link } from '@app/types';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class LinkListComponent {
  @Input() header?: string;
  @Input() links?: Link[];
}
