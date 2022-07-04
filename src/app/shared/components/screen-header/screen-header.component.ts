import { Component, Input, OnInit } from '@angular/core';
import {
  announcementIcon,
  ClarityIcons,
  crownIcon,
  imageGalleryIcon,
  unknownStatusIcon,
  usersIcon,
} from '@cds/core/icon';

@Component({
  selector: 'lcc-screen-header',
  templateUrl: './screen-header.component.html',
  styleUrls: ['./screen-header.component.scss'],
})
export class ScreenHeaderComponent implements OnInit {
  @Input() iconShape: string;
  @Input() title: string;
  @Input() preTitle?: string;
  @Input() postTitle: string;

  ngOnInit(): void {
    ClarityIcons.addIcons(
      announcementIcon,
      crownIcon,
      imageGalleryIcon,
      unknownStatusIcon,
      usersIcon
    );
  }
}
