import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ChangePasswordFormComponent } from '@app/components/change-password-form/change-password-form.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { MetaAndTitleService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';

@UntilDestroy()
@Component({
  selector: 'lcc-change-password-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header title="Change Password"></lcc-page-header>
      <lcc-change-password-form [hasCode]="vm.hasCode"></lcc-change-password-form>
    }
  `,
  imports: [ChangePasswordFormComponent, CommonModule, PageHeaderComponent],
})
export class ChangePasswordPageComponent implements OnInit {
  public viewModel$?: Observable<{ hasCode: boolean }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Change Password');
    this.metaAndTitleService.updateDescription(
      'Securely and conveniently change your London Chess Club password.',
    );

    this.viewModel$ = this.store.select(AuthSelectors.selectHasCode).pipe(
      untilDestroyed(this),
      map(hasCode => ({ hasCode })),
    );
  }
}
