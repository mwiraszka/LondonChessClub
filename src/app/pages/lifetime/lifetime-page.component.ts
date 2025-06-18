import { Component, OnInit } from '@angular/core';

import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { ImagePreloadDirective } from '@app/directives';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-lifetime-page',
  templateUrl: './lifetime-page.component.html',
  styleUrl: './lifetime-page.component.scss',
  imports: [ImagePreloadDirective, PageHeaderComponent],
})
export class LifetimePageComponent implements OnInit {
  public imagePath = 'assets/lifetime-achievement-awards/';

  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Lifetime');
    this.metaAndTitleService.updateDescription(
      'Lifetime Achievement Awards at the London Chess Club.',
    );
  }
}
