import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ImagesFormComponent } from '@app/components/images-form/images-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { EditorPage, Image, ImageFormData, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ImagesSelectors } from '@app/store/images';

@UntilDestroy()
@Component({
  selector: 'lcc-images-editor-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [title]="vm.pageTitle">
      </lcc-page-header>

      <lcc-images-form
        [album]="vm.album"
        [albumImageEntities]="vm.albumImageEntities"
        [existingAlbums]="vm.existingAlbums"
        [hasUnsavedChanges]="false">
      </lcc-images-form>

      <lcc-link-list [links]="[photoGalleryLink]"></lcc-link-list>
    }
  `,
  imports: [CommonModule, ImagesFormComponent, LinkListComponent, PageHeaderComponent],
})
export class ImagesEditorPageComponent implements EditorPage, OnInit {
  public readonly entity = 'images';
  public readonly photoGalleryLink: InternalLink = {
    text: 'Go to Photo Gallery',
    internalPath: 'photo-gallery',
    icon: 'photo_camera',
  };
  public viewModel$?: Observable<{
    album: string | null;
    albumImageEntities: { image: Image; formData: ImageFormData }[];
    existingAlbums: string[];
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
          this.store.select(ImagesSelectors.selectImageEntitiesByAlbum(album)),
        ]),
      ),
      map(([album, existingAlbums, albumImageEntities]) => ({
        album,
        albumImageEntities,
        existingAlbums: existingAlbums.filter(_album => _album !== album),
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
