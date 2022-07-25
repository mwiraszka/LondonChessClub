import { Component, Input, OnInit } from '@angular/core';
import { cameraIcon, ClarityIcons, plusCircleIcon } from '@cds/core/icon';

import { Link } from '@app/shared/types';

import { LinkListFacade } from './link-list.facade';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  providers: [LinkListFacade],
})
export class LinkListComponent implements OnInit {
  @Input() linkListTitle?: string;
  @Input() links: Link[];

  constructor(public facade: LinkListFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(cameraIcon, plusCircleIcon);
  }
}
