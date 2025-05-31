import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ImageFormComponent } from '@app/components/image-form/image-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { EditorPage, Image, ImageFormData, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ImagesSelectors } from '@app/store/images';
import { isDefined } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-images-editor-page',
  templateUrl: './images-editor-page.component.html',
  imports: [CommonModule, ImageFormComponent, LinkListComponent, PageHeaderComponent],
})
export class ImagesEditorPageComponent implements EditorPage, OnInit {
  public readonly entity = 'images';
  public readonly photoGalleryLink: InternalLink = {
    text: 'Go to Photo Gallery',
    internalPath: 'photo-gallery',
    icon: 'camera',
  };
  public viewModel$?: Observable<{
    album: string | null;
    existingAlbums: string[];
    albumImageEntities: { image: Image; formData: ImageFormData }[] | null;
    hasUnsavedChanges: boolean;
    pageTitle: string;
  }>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.viewModel$ = this.activatedRoute.params.pipe(
      untilDestroyed(this),
      map(params => (params['album'] ?? null) as string | null),
      switchMap(album =>
        combineLatest([
          of(album),
          this.store.select(ImagesSelectors.selectAllExistingAlbums),
          this.store
            .select(ImagesSelectors.selectImageEntitiesByAlbum(album))
            .pipe(filter(isDefined)),
        ]),
      ),
      map(([album, existingAlbums, albumImageEntities]) => ({
        album,
        existingAlbums,
        albumImageEntities,
        hasUnsavedChanges: true,
        pageTitle: album ? `Edit images from ${album}` : 'Add new images',
      })),
      tap(viewModel => {
        this.metaAndTitleService.updateTitle(viewModel.pageTitle);
        this.metaAndTitleService.updateDescription(
          `${viewModel.pageTitle} for the London Chess Club.`,
        );
      }),
    );
  }
}
