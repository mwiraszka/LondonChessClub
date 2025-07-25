import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ClubMapComponent } from '@app/components/club-map/club-map.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
  imports: [ClubMapComponent, MatIconModule, PageHeaderComponent, RouterLink],
})
export class AboutPageComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('About');
    this.metaAndTitleService.updateDescription(
      'A brief overview of the London Chess Club.',
    );
  }
}
