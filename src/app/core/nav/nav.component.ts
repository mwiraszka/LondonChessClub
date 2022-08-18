import { Component, HostListener } from '@angular/core';
import {
  administratorIcon,
  angleIcon,
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
import { NavPathTypes } from '../../shared/types/nav-paths.model';

@Component({
  selector: 'lcc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [NavFacade],
})
export class NavComponent {
  NavPathTypes = NavPathTypes;
  screenWidth!: number;
  tooltipScreenWidthCutoff = 699; // Match lt-md breakpoint value

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
  }

  constructor(public facade: NavFacade) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

    ClarityIcons.addIcons(
      administratorIcon,
      angleIcon,
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
