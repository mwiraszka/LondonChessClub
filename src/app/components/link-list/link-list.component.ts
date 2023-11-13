import { ClarityIcons, cameraIcon, plusIcon } from '@cds/core/icon';

import { Component, Input, OnInit } from '@angular/core';

import { Link } from '@app/types';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class LinkListComponent implements OnInit {
  @Input() title?: string;
  @Input() links?: Link[];

  ngOnInit(): void {
    ClarityIcons.addIcons(cameraIcon, plusIcon);
  }

  trackByFn = (index: number, link: Link) => link.path;
}
