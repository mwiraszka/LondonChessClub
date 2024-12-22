import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ToasterSelectors } from '@app/store/toaster';

import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'lcc-toaster',
  template: `
    @for (toast of toasts$ | async; track toast.title) {
      <lcc-toast [toast]="toast"></lcc-toast>
    }
  `,
  styleUrl: './toaster.component.scss',
  imports: [CommonModule, ToastComponent],
})
export class ToasterComponent {
  public readonly toasts$ = this.store.select(ToasterSelectors.selectToasts);

  constructor(private readonly store: Store) {}
}
