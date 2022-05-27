import { Component } from '@angular/core';
import {
  announcementIcon,
  ClarityIcons,
  crownIcon,
  homeIcon,
  imageGalleryIcon,
  tasksIcon,
  unknownStatusIcon,
  userIcon,
  usersIcon,
} from '@cds/core/icon';

import { NavFacade } from './store/nav.facade';
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
    ClarityIcons.addIcons(announcementIcon);
    ClarityIcons.addIcons(crownIcon);
    ClarityIcons.addIcons(homeIcon);
    ClarityIcons.addIcons(imageGalleryIcon);
    ClarityIcons.addIcons(tasksIcon);
    ClarityIcons.addIcons(unknownStatusIcon);
    ClarityIcons.addIcons(userIcon);
    ClarityIcons.addIcons(usersIcon);
  }
}
