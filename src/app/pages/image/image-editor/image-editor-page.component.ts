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
import type {
  EditorPage,
  EntityName,
  Image,
  ImageFormData,
  InternalLink,
} from '@app/models';
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
        [formData]="vm.formData"
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [originalImage]="vm.image">
      </lcc-image-form>
      <lcc-link-list [links]="links"></lcc-link-list>
    }
  `,
  imports: [CommonModule, ImageFormComponent, LinkListComponent, PageHeaderComponent],
})
export class ImageEditorPageComponent implements OnInit, EditorPage {
  public readonly entityName: EntityName = 'image';
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
    image: Image | null;
    formData: ImageFormData;
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
      map(params => (params['image_id'] ?? null) as string),
      switchMap(imageId =>
        combineLatest([
          this.store.select(ImagesSelectors.selectImageById(imageId)),
          this.store
            .select(ImagesSelectors.selectImageFormDataById(imageId))
            .pipe(filter(isDefined)),
          this.store.select(ImagesSelectors.selectHasUnsavedChanges(imageId)),
        ]),
      ),
      map(([image, formData, hasUnsavedChanges]) => ({
        image,
        formData,
        hasUnsavedChanges,
        pageTitle: image ? `Edit ${image.filename}` : 'Add images',
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
