import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-about-screen',
  templateUrl: './about-screen.component.html',
  styleUrl: './about-screen.component.scss',
  imports: [CommonModule, RouterLink, ScreenHeaderComponent],
})
export class AboutScreenComponent implements OnInit {
  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('About');
    this.metaAndTitleService.updateDescription(
      'A brief overview of the London Chess Club.',
    );
  }
}
