import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';
import type { Link } from '@app/types';

@Component({
  selector: 'lcc-photo-gallery-screen',
  template: `
    <lcc-screen-header
      title="Photo Gallery"
      icon="camera">
    </lcc-screen-header>
    <lcc-photo-grid></lcc-photo-grid>
    <lcc-link-list
      header="Archives"
      [links]="links"
      style="margin-top: 32px;">
    </lcc-link-list>
  `,
  imports: [CommonModule, LinkListComponent, PhotoGridComponent, ScreenHeaderComponent],
})
export class PhotoGalleryScreenComponent implements OnInit {
  public links: Link[] = [
    {
      path: 'https://drive.google.com/drive/folders/13J4PN7VCSs7XXnQi6VCmvShLwJmoPopv',
      text: '2023 Gladiators of the Chessboard Event',
    },
    {
      path: 'https://drive.google.com/drive/folders/1nUnwHj2XTTFUleGCjcM84z5sqVl912y_',
      text: '2023 Canadian Chess Open',
    },
    {
      path: 'https://drive.google.com/drive/folders/14uwnOw_CEm7PQY_U9MZtnroz6fzT1N2Y',
      text: '2023 Summer Solstice Showdown',
    },
    {
      path: 'https://drive.google.com/drive/folders/11JwShf308hBy237kq776sdsQWfYSDvxz',
      text: '2023 Tandem Simul',
    },
    {
      path: 'https://drive.google.com/drive/folders/1fk9U4VlVZunu-q3kMy201BUfllqD2oBh',
      text: '2023 Active Championship',
    },
    {
      path: 'https://drive.google.com/drive/folders/1x4iG-ovszRcGBoKu-ykBKT6a3IxWOw1Z',
      text: '2023 Lifetime Achievement Awards',
    },
    {
      path: 'https://drive.google.com/drive/folders/1rhlEzvFGx0xfokEXv09_NcbGKvncSg9L',
      text: '2023 Dave Jackson Memorial',
    },
    {
      path: 'https://drive.google.com/drive/folders/1N_DqzV1IPNKyvKAYc9C5mFR0aoZNeScr',
      text: '2023 London vs. Western Olympiad',
    },
    {
      path: 'https://www.flickr.com/photos/184509003@N07',
      text: '2017 - 2022',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=4918',
      text: 'June 2016',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=4535',
      text: 'April 2016',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=3644',
      text: '2015',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=1343',
      text: '2011 - 2014',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=926',
      text: '2009 - 2010',
    },
    {
      path: 'http://londonchessclub.ca/?page_id=924',
      text: '2008',
    },
    {
      path: 'https://londonchessclub.ca/?page_id=916',
      text: '2007 and older',
    },
  ].map(link => ({ ...link, icon: 'camera' }));

  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Photo Gallery');
    this.metaAndTitleService.updateDescription(
      'Browse through photos of our club events over the years.',
    );
  }
}
