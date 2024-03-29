import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Component, OnInit } from '@angular/core';

import { UpdateService } from '@app/services';

import packageJson from '../../../../package.json';

@UntilDestroy()
@Component({
  selector: 'lcc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentVersion = packageJson.version;
  currentYear = new Date().getFullYear();
  isNewVersionAvailable!: boolean;

  constructor(public updateService: UpdateService) {}

  ngOnInit(): void {
    this.updateService.isNewVersionAvailable$
      .pipe(untilDestroyed(this))
      .subscribe(val => (this.isNewVersionAvailable = val));
  }
}
