import { Component, OnInit } from '@angular/core';
import { cameraIcon, ClarityIcons, imageGalleryIcon } from '@cds/core/icon';

import { PhotoGalleryScreenFacade } from './photo-gallery-screen.facade';
import { Link } from '@app/shared/types';

@Component({
  selector: 'lcc-photo-gallery-screen',
  templateUrl: './photo-gallery-screen.component.html',
  styleUrls: ['./photo-gallery-screen.component.scss'],
})
export class PhotoGalleryScreenComponent implements OnInit {
  links: Link[] = [
    { url: 'https://www.flickr.com/photos/184509003@N07/', text: '2019 onwards' },
    { url: 'http://londonchessclub.ca/?page_id=4918', text: 'June 2016' },
    { url: 'http://londonchessclub.ca/?page_id=4535', text: 'April 2016' },
    { url: 'http://londonchessclub.ca/?page_id=3644', text: '2015' },
    { url: 'http://londonchessclub.ca/?page_id=1343', text: '2011' },
    { url: 'http://londonchessclub.ca/?page_id=926', text: '2009' },
    { url: 'http://londonchessclub.ca/?page_id=924', text: '2008' },
    { url: 'http://londonchessclub.ca/?page_id=916', text: '2007 and older' },
  ];

  constructor(public facade: PhotoGalleryScreenFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(cameraIcon, imageGalleryIcon);
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
