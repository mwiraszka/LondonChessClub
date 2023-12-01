import { Component, Input } from '@angular/core';

import { Link } from '@app/types';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class LinkListComponent {
  @Input() title?: string;
  @Input() links?: Link[];

  trackByFn = (index: number, link: Link) => link.path;
}
