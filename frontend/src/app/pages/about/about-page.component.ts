import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ClubCardComponent } from '@app/components/club-card/club-card.component';
import { ExpansionPanelComponent } from '@app/components/expansion-panel/expansion-panel.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { LCC_CLUB } from '@app/constants/clubs';
import { Club } from '@app/models';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
  imports: [
    MatIconModule,
    PageHeaderComponent,
    RouterLink,
    ClubCardComponent,
    ExpansionPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent implements OnInit {
  public readonly lccClub: Club = LCC_CLUB;

  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('About');
    this.metaAndTitleService.updateDescription(
      'A brief overview of the London Chess Club.',
    );
  }
}
