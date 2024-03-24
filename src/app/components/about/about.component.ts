/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/types';

import { environment } from '@environments/environment';

@Component({
  selector: 'lcc-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  NavPathTypes = NavPathTypes;

  @Input() isAboutScreen = false;

  isMapLoaded$!: Observable<boolean>;
  mapHeight!: string;
  clubLocation: google.maps.LatLngLiteral = { lat: 42.982528, lng: -81.261401 };
  mapOptions!: google.maps.MapOptions;

  constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.resizeMap(window.innerWidth);
    this.isMapLoaded$ = this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMaps.apiKey}`,
        'callback',
      )
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.resizeMap(window.innerWidth);
  }

  onNavigate(path: NavPathTypes): void {
    this.router.navigate([path]);
  }

  private resizeMap(screenWidth: number): void {
    this.mapHeight = screenWidth > 500 && screenWidth < 700 ? '350px' : '250px';
    this.mapOptions = {
      center: this.clubLocation,
      zoom: screenWidth > 500 ? 16 : 15,
      mapTypeControl: false,
    };
  }
}
