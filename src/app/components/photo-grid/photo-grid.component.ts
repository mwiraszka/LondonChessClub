import { featuredPhotos } from 'assets/photos';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PhotoViewerComponent } from '@app/components/photo-viewer/photo-viewer.component';
import { DialogService } from '@app/services';

@Component({
  selector: 'lcc-photo-grid',
  template: `
    @for (
      photo of featuredPhotos.slice(0, maxPhotos ?? featuredPhotos.length);
      let index = $index;
      track photo.filename
    ) {
      <img
        [src]="getThumbnailPath(photo.filename)"
        [alt]="photo.name"
        (click)="onClickPhoto(index)" />
    }
  `,
  styleUrl: './photo-grid.component.scss',
  imports: [CommonModule],
})
export class PhotoGridComponent {
  @Input() public maxPhotos?: number;

  public readonly featuredPhotos = featuredPhotos;

  constructor(private readonly dialogService: DialogService) {}

  public async onClickPhoto(index: number): Promise<void> {
    await this.dialogService.open<PhotoViewerComponent, null>({
      componentType: PhotoViewerComponent,
      isModal: true,
      inputs: { photos: featuredPhotos, index },
    });
  }

  public getThumbnailPath(filename: string): string {
    const [name, extension] = filename.split('.');
    return `assets/photos/${name}-320.${extension}`;
  }
}
