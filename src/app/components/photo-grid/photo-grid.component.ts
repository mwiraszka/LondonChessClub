import { photos } from 'assets/photos';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PhotoViewerComponent } from '@app/components/photo-viewer/photo-viewer.component';
import { DialogService } from '@app/services';

@Component({
  selector: 'lcc-photo-grid',
  template: `
    @for (
      photo of photos.slice(0, maxPhotos ?? photos.length);
      let index = $index;
      track photo.fileName
    ) {
      <img
        [src]="'assets/photos/' + photo.fileName + '-320.jpg'"
        [alt]="photo.caption"
        (click)="onClickPhoto(index)" />
    }
  `,
  styleUrl: './photo-grid.component.scss',
  imports: [CommonModule],
})
export class PhotoGridComponent {
  @Input() public maxPhotos?: number;

  public readonly photos = photos;

  constructor(
    private readonly dialogService: DialogService<PhotoViewerComponent, null>,
  ) {}

  public async onClickPhoto(index: number): Promise<void> {
    await this.dialogService.open({
      componentType: PhotoViewerComponent,
      isModal: true,
      inputs: { photos, index },
    });
  }
}
