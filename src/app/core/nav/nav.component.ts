import { Component } from '@angular/core';
import {
  announcementIcon,
  ClarityIcons,
  crownIcon,
  eventIcon,
  homeIcon,
  imageGalleryIcon,
  unknownStatusIcon,
  userIcon,
  usersIcon,
} from '@cds/core/icon';

import { NavFacade } from './nav.facade';
import { NavPathTypes } from './types/nav-paths.model';

@Component({
  selector: 'lcc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [NavFacade],
})
export class NavComponent {
  NavPathTypes = NavPathTypes;

  constructor(public facade: NavFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(
      announcementIcon,
      crownIcon,
      homeIcon,
      imageGalleryIcon,
      eventIcon,
      unknownStatusIcon,
      userIcon,
      usersIcon
    );
  }
}
