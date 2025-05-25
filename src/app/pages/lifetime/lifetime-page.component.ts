import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import IconsModule from '@app/icons';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-lifetime-page',
  templateUrl: './lifetime-page.component.html',
  styleUrl: './lifetime-page.component.scss',
  imports: [CommonModule, IconsModule, PageHeaderComponent],
})
export class LifetimePageComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Lifetime');
    this.metaAndTitleService.updateDescription(
      'Lifetime Achievement Awards at the London Chess Club.',
    );
  }
}
