import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DialogOutput, MemberWithNewRatings } from '@app/models';

@Component({
  selector: 'lcc-rating-changes',
  templateUrl: './rating-changes.component.html',
  styleUrl: './rating-changes.component.scss',
  imports: [CommonModule],
})
export class RatingChangesComponent implements DialogOutput<'confirm' | 'cancel'> {
  @Input() membersWithNewRatings?: MemberWithNewRatings[];
  @Input() unmatchedMembers?: string[];

  @Output() dialogResult = new EventEmitter<'confirm' | 'cancel' | 'close'>();
}
