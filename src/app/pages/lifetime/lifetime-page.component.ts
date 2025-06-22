import { KeyValuePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { KebabCasePipe } from '@app/pipes';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-lifetime-page',
  templateUrl: './lifetime-page.component.html',
  styleUrl: './lifetime-page.component.scss',
  imports: [ImagePreloadDirective, KebabCasePipe, KeyValuePipe, PageHeaderComponent],
})
export class LifetimePageComponent implements OnInit {
  public readonly IMAGE_PATH = 'assets/lifetime-achievement-awards/';
  public readonly RECIPIENTS_MAP = new Map<number, string[]>([
    [2025, ['Hans Jung', 'Todd Southam', 'John Zoccano']],
    [2024, ['Don Armstrong', 'David Jackson', 'Steve Killi', 'Jay Zendrowski']],
    [2023, ['Steve Demmery', 'Jim Kearley', 'Gerry Litchfield']],
  ]);

  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Lifetime');
    this.metaAndTitleService.updateDescription(
      'Lifetime Achievement Awards at the London Chess Club.',
    );
  }

  public originalOrder = (): number => {
    return 0;
  };
}
