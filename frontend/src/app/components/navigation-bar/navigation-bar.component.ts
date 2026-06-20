import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DropdownDirective } from '@app/directives/dropdown.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { InternalLink } from '@app/models';
import { RouterLinkPipe } from '@app/pipes';

@Component({
  selector: 'lcc-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  imports: [
    DropdownDirective,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    RouterLinkPipe,
    TooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  public readonly links: InternalLink[] = [
    {
      text: 'Home',
      internalPath: '',
      icon: 'home',
    },
    {
      text: 'About',
      internalPath: 'about',
      icon: 'info',
    },
    {
      text: 'Members',
      internalPath: 'members',
      icon: 'groups',
    },
    {
      text: 'Schedule',
      internalPath: 'schedule',
      icon: 'calendar_month',
    },
    {
      text: 'News',
      internalPath: 'news',
      icon: 'map',
    },
    {
      text: 'City Champion',
      internalPath: 'city-champion',
      icon: 'emoji_events',
    },
    {
      text: 'Photo Gallery',
      internalPath: 'photo-gallery',
      icon: 'photo_camera',
    },
    {
      text: 'Game Archives',
      internalPath: 'game-archives',
      icon: 'insert_chart_outlined',
    },
  ];

  public isDropdownOpen = false;
  public screenWidth = window.innerWidth;

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }
}
