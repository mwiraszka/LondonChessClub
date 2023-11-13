import {
  ClarityIcons,
  announcementIcon,
  crownIcon,
  eventIcon,
  imageGalleryIcon,
  infoStandardIcon,
  usersIcon,
} from '@cds/core/icon';

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lcc-screen-header',
  templateUrl: './screen-header.component.html',
  styleUrls: ['./screen-header.component.scss'],
})
export class ScreenHeaderComponent implements OnInit {
  @Input() iconShape?: string | null;
  @Input() title?: string | null;
  @Input() preTitle?: string | null;
  @Input() postTitle?: string | null;

  ngOnInit(): void {
    ClarityIcons.addIcons(
      announcementIcon,
      crownIcon,
      eventIcon,
      imageGalleryIcon,
      infoStandardIcon,
      usersIcon,
    );
  }
}
