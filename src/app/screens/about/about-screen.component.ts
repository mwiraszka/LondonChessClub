import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';
import { NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-about-screen',
  templateUrl: './about-screen.component.html',
  styleUrls: ['./about-screen.component.scss'],
  imports: [CommonModule, ScreenHeaderComponent, RouterLink],
})
export class AboutScreenComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;

  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('About');
    this.metaAndTitleService.updateDescription(
      'A brief overview of the London Chess Club.',
    );
  }
}
