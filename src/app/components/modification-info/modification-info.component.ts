import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ModificationInfo } from '@app/models';
import { FormatDatePipe } from '@app/pipes';

@Component({
  selector: 'lcc-modification-info',
  template: `
    <div class="modification-info-container">
      <div class="create-details-container">
        <mat-icon>post_add</mat-icon>

        <div class="create-text">
          <span>created by</span>
          <span class="name">{{ info.createdBy }}</span>
          <span class="vertical-spacer">|</span>
          <span class="date">{{ info.dateCreated | formatDate: 'short' }}</span>
        </div>
      </div>

      @if (info.dateCreated !== info.dateLastEdited) {
        <div class="edit-details-container">
          <mat-icon>edit</mat-icon>

          <div class="edit-text">
            <span>last edited by</span>
            <span class="name">{{ info.lastEditedBy }}</span>
            <span class="vertical-spacer">|</span>
            <span class="date">{{ info.dateLastEdited | formatDate: 'short' }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './modification-info.component.scss',
  imports: [FormatDatePipe, MatIconModule],
})
export class ModificationInfoComponent {
  @Input({ required: true }) info!: ModificationInfo;
}
