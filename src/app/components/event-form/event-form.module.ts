import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from '@app/components/tooltip';

import { ModificationInfoModule } from '../modification-info';
import { EventFormComponent } from './event-form.component';

@NgModule({
  declarations: [EventFormComponent],
  imports: [CommonModule, ModificationInfoModule, ReactiveFormsModule, TooltipModule],
  exports: [EventFormComponent],
})
export class EventFormModule {}
