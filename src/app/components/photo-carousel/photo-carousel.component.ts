import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Image } from '@app/models';

@Component({
  selector: 'lcc-photo-carousel',
  templateUrl: './photo-carousel.component.html',
  styleUrl: './photo-carousel.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCarouselComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public photos!: Partial<Image>[];

  public currentIndex = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private intervalId: any;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.startAutoCycle();
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  public onPreviousPhoto(): void {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.restartAutoCycle();
  }

  public onNextPhoto(): void {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.restartAutoCycle();
  }

  public onSelectPhoto(index: number): void {
    this.currentIndex = index;
    this.restartAutoCycle();
  }

  private restartAutoCycle(): void {
    clearInterval(this.intervalId);
    this.startAutoCycle();
  }

  private startAutoCycle(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
      this.changeDetectorRef.markForCheck();
    }, 4000);
  }
}
