import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cameraIcon, ClarityIcons, plusCircleIcon } from '@cds/core/icon';

import { Link } from '@app/shared/types';

@Component({
  selector: 'lcc-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class LinkListComponent implements OnInit {
  @Input() linkListTitle?: string;
  @Input() links: Link[];

  ngOnInit(): void {
    ClarityIcons.addIcons(cameraIcon, plusCircleIcon);
  }

  onSelect(link: Link): void {
    if (link.path.includes('londonchessclub.ca')) {
      window.open(link.path, '_blank');
    } else {
      this.router.navigate([link.path]);
    }
  }

  constructor(private router: Router) {}
}
