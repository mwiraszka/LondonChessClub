import { Component, Input } from '@angular/core';

import { Link } from '@app/shared/types';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class LinkListComponent {
  @Input() linkListTitle?: string;
  @Input() links: Link[];
}
