import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ImageFormComponent } from '@app/components/image-form/image-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { EditorPage, Image, ImageFormData, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ImagesSelectors } from '@app/store/images';

@UntilDestroy()
@Component({
  selector: 'lcc-image-editor-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [title]="vm.pageTitle">
      </lcc-page-header>
      <lcc-image-form
        [existingAlbums]="vm.existingAlbums"
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [imageEntity]="vm.imageEntity"
        [newImageFormData]="vm.newImageFormData">
      </lcc-image-form>
      <lcc-link-list [links]="[photoGalleryPageLink]"></lcc-link-list>
    }
  `,
  imports: [CommonModule, ImageFormComponent, LinkListComponent, PageHeaderComponent],
})
export class ImageEditorPageComponent implements EditorPage, OnInit {
  public readonly entity = 'image';
  public readonly photoGalleryPageLink: InternalLink = {
    text: 'Go to Photo Gallery',
    internalPath: 'photo-gallery',
    icon: 'photo_camera',
  };
  public viewModel$?: Observable<{
    existingAlbums: string[];
    hasUnsavedChanges: boolean;
    imageEntity: { image: Image; formData: ImageFormData } | null;
    newImageFormData: ImageFormData | null;
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
      map(params => (params['image_id'] ?? null) as string | null),
      switchMap(imageId =>
        combineLatest([
          this.store.select(ImagesSelectors.selectImageEntityById(imageId)),
          this.store.select(ImagesSelectors.selectNewImageFormData),
          this.store.select(ImagesSelectors.selectAllExistingAlbums),
          this.store.select(ImagesSelectors.selectImageHasUnsavedChanges(imageId)),
        ]),
      ),
      map(([imageEntity, newImageFormData, existingAlbums, hasUnsavedChanges]) => ({
        existingAlbums,
        newImageFormData,
        hasUnsavedChanges,
        imageEntity,
        pageTitle: imageEntity ? `Edit ${imageEntity.image.filename}` : 'Add an image',
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
