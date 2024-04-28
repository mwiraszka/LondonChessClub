import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';
import { NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-about-screen',
  templateUrl: './about-screen.component.html',
  styleUrls: ['./about-screen.component.scss'],
})
export class AboutScreenComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;

  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('About');
    this.metaAndTitleService.updateDescription('Learn all about the London Chess Club.');
  }
}
