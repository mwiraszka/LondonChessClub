import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cameraIcon, ClarityIcons, plusCircleIcon } from '@cds/core/icon';

import { Link } from '@app/types';

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

  // Return the link to the parent component in case additional logic
  // needs to be implemented on top of the navigation itself
  @Output() select = new EventEmitter<Link>();

  constructor(public facade: LinkListFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(cameraIcon, plusCircleIcon);
  }

  trackByFn(index: number, link: Link): string {
    return link.path;
  }

  onSelect(link: Link): void {
    this.facade.onSelect(link.path);
    this.select.emit(link);
  }
}
