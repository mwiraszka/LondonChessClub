import { Component } from '@angular/core';

import { Link, Photo } from '@app/types';

import { PhotoGalleryScreenFacade } from './photo-gallery-screen.facade';

@Component({
  selector: 'lcc-photo-gallery-screen',
  templateUrl: './photo-gallery-screen.component.html',
  styleUrls: ['./photo-gallery-screen.component.scss'],
  providers: [PhotoGalleryScreenFacade],
})
export class PhotoGalleryScreenComponent {
  photos: Photo[] = [
    { index: 1, description: '' },
    { index: 2, description: '' },
    { index: 3, description: '' },
    { index: 4, description: '' },
    { index: 5, description: '' },
    { index: 6, description: '' },
    { index: 7, description: '' },
    { index: 8, description: '' },
    { index: 9, description: '' },
    { index: 10, description: '' },
    { index: 11, description: '' },
    { index: 12, description: '' },
    { index: 13, description: '' },
    { index: 14, description: '' },
    { index: 15, description: '' },
    { index: 16, description: '' },
  ];

  links: Link[] = [
    {
      path: 'https://www.flickr.com/photos/184509003@N07/',
      text: '2017 - 2021',
      iconShape: 'camera',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=4918',
      text: 'June 2016',
      iconShape: 'camera',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=4535',
      text: 'April 2016',
      iconShape: 'camera',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=3644',
      text: '2015',
      iconShape: 'camera',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=1343',
      text: '2011 - 2014',
      iconShape: 'camera',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=926',
      text: '2009 - 2010',
      iconShape: 'camera',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=924',
      text: '2008',
      iconShape: 'camera',
    },
    {
      path: 'https://londonchessclub.ca/?page_id=916',
      text: '2007 and older',
      iconShape: 'camera',
    },
  ];

  constructor(public facade: PhotoGalleryScreenFacade) {}
}
