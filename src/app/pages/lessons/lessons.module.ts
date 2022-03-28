import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { LessonsComponent } from '@app/pages/lessons';

@NgModule({
  declarations: [LessonsComponent],
  imports: [ClarityModule, CommonModule],
})
export class LessonsModule {}
