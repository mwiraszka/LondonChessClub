import {
  ClarityIcons,
  administratorIcon,
  angleIcon,
  announcementIcon,
  crownIcon,
  eventIcon,
  homeIcon,
  imageGalleryIcon,
  infoStandardIcon,
  userIcon,
  usersIcon,
} from '@cds/core/icon';

import { Component, HostListener, OnInit } from '@angular/core';

import { NavPathTypes } from '@app/types';

import { NavFacade } from './nav.facade';

@Component({
  selector: 'lcc-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [NavFacade],
})
export class NavComponent implements OnInit {
  NavPathTypes = NavPathTypes;
  screenWidth!: number;
  tooltipScreenWidthCutoff = 699; // Match lt-md breakpoint value

  @HostListener('window:resize', ['$event'])
  onResize(): void {
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
      eventIcon,
      homeIcon,
      imageGalleryIcon,
      infoStandardIcon,
      userIcon,
      usersIcon,
    );
  }
}
