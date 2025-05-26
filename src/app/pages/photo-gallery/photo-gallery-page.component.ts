import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import type { ExternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';

@UntilDestroy()
@Component({
  selector: 'lcc-photo-gallery-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        title="Photo Gallery"
        icon="camera">
      </lcc-page-header>

      <lcc-photo-grid [isAdmin]="vm.isAdmin"></lcc-photo-grid>

      <lcc-link-list
        header="More photos (soon to be migrated here)"
        [links]="links"
        style="margin-top: 32px;">
      </lcc-link-list>
    }
  `,
  imports: [CommonModule, LinkListComponent, PhotoGridComponent, PageHeaderComponent],
})
export class PhotoGalleryPageComponent implements OnInit {
  public links: ExternalLink[] = [
    {
      text: '2023 Gladiators of the Chessboard Event',
      externalPath:
        'https://drive.google.com/drive/folders/13J4PN7VCSs7XXnQi6VCmvShLwJmoPopv',
    },
    {
      text: '2023 Canadian Chess Open',
      externalPath:
        'https://drive.google.com/drive/folders/1nUnwHj2XTTFUleGCjcM84z5sqVl912y_',
    },
    {
      text: '2023 Summer Solstice Showdown',
      externalPath:
        'https://drive.google.com/drive/folders/14uwnOw_CEm7PQY_U9MZtnroz6fzT1N2Y',
    },
    {
      text: '2023 Tandem Simul',
      externalPath:
        'https://drive.google.com/drive/folders/11JwShf308hBy237kq776sdsQWfYSDvxz',
    },
    {
      text: '2023 Active Championship',
      externalPath:
        'https://drive.google.com/drive/folders/1fk9U4VlVZunu-q3kMy201BUfllqD2oBh',
    },
    {
      text: '2023 Lifetime Achievement Awards',
      externalPath:
        'https://drive.google.com/drive/folders/1x4iG-ovszRcGBoKu-ykBKT6a3IxWOw1Z',
    },
    {
      text: '2023 Dave Jackson Memorial',
      externalPath:
        'https://drive.google.com/drive/folders/1rhlEzvFGx0xfokEXv09_NcbGKvncSg9L',
    },
    {
      text: '2023 London vs. Western Olympiad',
      externalPath:
        'https://drive.google.com/drive/folders/1N_DqzV1IPNKyvKAYc9C5mFR0aoZNeScr',
    },
    {
      text: 'Photo archives (2017 - 2022)',
      externalPath: 'https://www.flickr.com/photos/184509003@N07',
    },
    {
      text: 'Photo archives (June 2016)',
      externalPath: 'http://londonchessclub.ca/?page_id=4918',
    },
    {
      text: 'Photo archives (April 2016)',
      externalPath: 'http://londonchessclub.ca/?page_id=4535',
    },
    {
      text: 'Photo archives (2015)',
      externalPath: 'http://londonchessclub.ca/?page_id=3644',
    },
    {
      text: 'Photo archives (2011 - 2014)',
      externalPath: 'http://londonchessclub.ca/?page_id=1343',
    },
    {
      text: 'Photo archives (2009 - 2010)',
      externalPath: 'http://londonchessclub.ca/?page_id=926',
    },
    {
      text: 'Photo archives (2008)',
      externalPath: 'http://londonchessclub.ca/?page_id=924',
    },
    {
      text: 'Photo archives (2007 and older)',
      externalPath: 'https://londonchessclub.ca/?page_id=916',
    },
  ].map(link => ({ ...link, icon: 'camera' }));
  public viewModel$?: Observable<{ isAdmin: boolean }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Photo Gallery');
    this.metaAndTitleService.updateDescription(
      'Browse through photos of our club events over the years.',
    );

    this.viewModel$ = this.store.select(AuthSelectors.selectIsAdmin).pipe(
      untilDestroyed(this),
      map(isAdmin => ({ isAdmin })),
    );
  }
}
