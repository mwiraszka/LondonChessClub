import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
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
  selector: 'lcc-image-editor-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [title]="vm.pageTitle">
      </lcc-page-header>
      <lcc-image-form
        [existingAlbums]="vm.existingAlbums"
        [formData]="vm.formData"
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [originalImage]="vm.originalImage">
      </lcc-image-form>
      <lcc-link-list [links]="links"></lcc-link-list>
    }
  `,
  imports: [CommonModule, ImageFormComponent, LinkListComponent, PageHeaderComponent],
})
export class ImageEditorPageComponent implements EditorPage, OnInit {
  public readonly entity = 'image';
  public readonly links: InternalLink[] = [
    {
      text: 'Go to Photo Gallery',
      internalPath: 'photo-gallery',
      icon: 'camera',
    },
    {
      text: 'Return home',
      internalPath: '',
      icon: 'home',
    },
  ];
  public viewModel$?: Observable<{
    existingAlbums: string[];
    formData: ImageFormData;
    hasUnsavedChanges: boolean;
    originalImage: Image | null;
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
          this.store.select(ImagesSelectors.selectImageById(imageId)),
          this.store
            .select(ImagesSelectors.selectImageFormDataById(imageId))
            .pipe(filter(isDefined)),
          this.store.select(ImagesSelectors.selectAllExistingAlbums),
          this.store.select(ImagesSelectors.selectHasUnsavedChanges(imageId)),
        ]),
      ),
      map(([originalImage, formData, existingAlbums, hasUnsavedChanges]) => ({
        originalImage,
        formData,
        existingAlbums,
        hasUnsavedChanges,
        pageTitle: originalImage ? `Edit ${originalImage.filename}` : 'Add an image',
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
