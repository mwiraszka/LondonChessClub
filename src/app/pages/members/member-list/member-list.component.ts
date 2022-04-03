import { Component, OnInit } from '@angular/core';
import { filter, first, tap } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';

import { MemberListFacade } from './store/member-list.facade';

@Component({
  selector: 'lcc-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
  providers: [MemberListFacade],
})
export class MemberListComponent implements OnInit {
  constructor(public facade: MemberListFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.loader.display(true);
    this.facade.loadMembers();
    this.facade.members$
      .pipe(
        filter((articles) => !!articles),
        tap(() => this.loader.display(false)),
        first()
      )
      .subscribe();
  }
}
