import { Component, OnInit } from '@angular/core';
import { cameraIcon, ClarityIcons, imageGalleryIcon } from '@cds/core/icon';

import { PhotoGalleryFacade } from './photo-gallery.facade';
import { Link } from '@app/shared/types';

@Component({
  selector: 'lcc-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
})
export class PhotoGalleryComponent implements OnInit {
  links: Link[] = [
    {
      url: 'https://www.flickr.com/photos/184509003@N07/',
      alt: '2019 onwards',
      text: '2019 onwards',
    },
    {
      url: 'http://londonchessclub.ca/?page_id=4918',
      alt: 'June 2016',
      text: 'June 2016',
    },
    {
      url: 'http://londonchessclub.ca/?page_id=4535',
      alt: 'April 2016',
      text: 'April 2016',
    },
    {
      url: 'http://londonchessclub.ca/?page_id=3644',
      alt: '2015',
      text: '2015',
    },
    {
      url: 'http://londonchessclub.ca/?page_id=1343',
      alt: '2011',
      text: '2011',
    },
    {
      url: 'http://londonchessclub.ca/?page_id=926',
      alt: '2009',
      text: '2009',
    },
    {
      url: 'http://londonchessclub.ca/?page_id=924',
      alt: '2008',
      text: '2008',
    },
    {
      url: 'http://londonchessclub.ca/?page_id=916',
      alt: '2007 and older',
      text: '2007 and older',
    },
  ];

  constructor(public facade: PhotoGalleryFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(cameraIcon, imageGalleryIcon);
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
