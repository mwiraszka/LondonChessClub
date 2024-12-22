import { photos } from 'assets/photos';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PhotoViewerComponent } from '@app/components/photo-viewer/photo-viewer.component';
import { DialogService } from '@app/services';

@Component({
  selector: 'lcc-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.scss',
  imports: [CommonModule],
})
export class PhotoGridComponent {
  @Input() public maxPhotos?: number;

  public readonly photos = photos;

  constructor(private readonly dialogService: DialogService<PhotoViewerComponent>) {}

  public onClickPhoto(index: number): void {
    this.dialogService.open({
      component: PhotoViewerComponent,
      inputs: { photos, index },
    });
  }
}
