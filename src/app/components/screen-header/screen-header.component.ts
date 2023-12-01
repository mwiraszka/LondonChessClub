import { Component, Input } from '@angular/core';

@Component({
  selector: 'lcc-screen-header',
  templateUrl: './screen-header.component.html',
  styleUrls: ['./screen-header.component.scss'],
})
export class ScreenHeaderComponent {
  @Input() iconShape?: string | null;
  @Input() title?: string | null;
  @Input() preTitle?: string | null;
  @Input() postTitle?: string | null;
}
