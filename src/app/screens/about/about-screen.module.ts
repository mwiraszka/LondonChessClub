import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AboutModule } from '@app/components/about';
import { ScreenHeaderModule } from '@app/components/screen-header';
import { NavPathTypes } from '@app/types';

import { AboutScreenComponent } from './about-screen.component';

@NgModule({
  declarations: [AboutScreenComponent],
  imports: [AboutModule, CommonModule, RouterModule, ScreenHeaderModule],
})
export class AboutScreenModule {
  constructor(private readonly router: Router) {}

  onNavigate(path: NavPathTypes): void {
    this.router.navigate([path]);
  }
}
