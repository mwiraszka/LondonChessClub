import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, timer } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { Image } from '@app/models';

@UntilDestroy()
@Component({
  selector: 'lcc-photo-carousel',
  templateUrl: './photo-carousel.component.html',
  styleUrl: './photo-carousel.component.scss',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCarouselComponent implements OnInit {
  @Input({ required: true }) public photos!: Partial<Image>[];

  public currentIndex = 0;

  private readonly autoCycleSubject$ = new Subject<void>();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.autoCycleSubject$
      .pipe(
        startWith(null),
        switchMap(() => timer(4000, 4000)),
        untilDestroyed(this),
      )
      .subscribe(() => {
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.changeDetectorRef.markForCheck();
      });
  }

  public onPreviousPhoto(): void {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.autoCycleSubject$.next();
  }

  public onNextPhoto(): void {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.autoCycleSubject$.next();
  }

  public onSelectPhoto(index: number): void {
    this.currentIndex = index;
    this.autoCycleSubject$.next();
  }
}
