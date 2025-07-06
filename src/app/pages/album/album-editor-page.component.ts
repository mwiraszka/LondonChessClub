import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlbumFormComponent } from '@app/components/album-form/album-form.component';
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

      <lcc-album-form
        [album]="vm.album"
        [existingAlbums]="vm.existingAlbums"
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [imageEntities]="vm.imageEntities"
        [newImagesFormData]="vm.newImagesFormData">
      </lcc-album-form>

      <lcc-link-list [links]="[photoGalleryLink]"></lcc-link-list>
    }
  `,
  imports: [CommonModule, AlbumFormComponent, LinkListComponent, PageHeaderComponent],
})
export class AlbumEditorPageComponent implements EditorPage, OnInit {
  public readonly entity = 'album';
  public readonly photoGalleryLink: InternalLink = {
    text: 'Go to Photo Gallery',
    internalPath: 'photo-gallery',
    icon: 'photo_camera',
  };
  public viewModel$?: Observable<{
    album: string | null;
    existingAlbums: string[];
    hasUnsavedChanges: boolean | null;
    imageEntities: { image: Image; formData: ImageFormData }[];
    newImagesFormData: Record<string, ImageFormData>;
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
          this.store.select(ImagesSelectors.selectImageEntitiesByAlbum(album)),
          this.store.select(ImagesSelectors.selectNewImagesFormData),
          this.store.select(ImagesSelectors.selectAllExistingAlbums),
          this.store.select(ImagesSelectors.selectAlbumHasUnsavedChanges(album)),
        ]),
      ),
      map(
        ([
          album,
          imageEntities,
          newImagesFormData,
          existingAlbums,
          hasUnsavedChanges,
        ]) => ({
          album,
          existingAlbums,
          hasUnsavedChanges,
          imageEntities,
          newImagesFormData,
          pageTitle: album ? `Edit ${album}` : 'Create a new album',
        }),
      ),
      tap(viewModel => {
        this.metaAndTitleService.updateTitle(viewModel.pageTitle);
        this.metaAndTitleService.updateDescription(
          `${viewModel.pageTitle} for the London Chess Club.`,
        );
      }),
    );
  }
}
