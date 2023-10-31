import { ClarityIcons, cameraIcon, plusCircleIcon } from '@cds/core/icon';

import { Component, Input, OnInit } from '@angular/core';

import { Link } from '@app/types';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class LinkListComponent implements OnInit {
  @Input() linkListTitle?: string;
  @Input() links?: Link[];

  ngOnInit(): void {
    ClarityIcons.addIcons(cameraIcon, plusCircleIcon);
  }

  trackByFn = (index: number, link: Link) => link.path;
}
