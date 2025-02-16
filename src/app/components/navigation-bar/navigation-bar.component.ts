import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DropdownDirective } from '@app/directives/dropdown.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import type { InternalLink } from '@app/models';
import { RouterLinkPipe } from '@app/pipes';

@Component({
  selector: 'lcc-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
  imports: [
    CommonModule,
    DropdownDirective,
    IconsModule,
    RouterLink,
    RouterLinkActive,
    RouterLinkPipe,
    TooltipDirective,
  ],
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
      icon: 'users',
    },
    {
      text: 'Schedule',
      internalPath: 'schedule',
      icon: 'calendar',
    },
    {
      text: 'News',
      internalPath: 'news',
      icon: 'activity',
    },
    {
      text: 'City Champion',
      internalPath: 'city-champion',
      icon: 'award',
    },
    {
      text: 'Photo Gallery',
      internalPath: 'photo-gallery',
      icon: 'camera',
    },
    {
      text: 'Game Archives',
      internalPath: 'game-archives',
      icon: 'grid',
    },
  ];

  public isDropdownOpen = false;
  public screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  private onResize(): void {
    this.screenWidth = window.innerWidth;
  }
}
