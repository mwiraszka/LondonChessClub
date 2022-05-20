import { Component, OnInit } from '@angular/core';

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
    this.facade.loadMembers();
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });
  }
}
