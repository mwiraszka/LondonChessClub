import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/types';
import { environment } from '@environments/environment';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'lcc-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  NavPathTypes = NavPathTypes;

  mapHeight!: string;
  mapWidth!: string;
  isMapLoaded$?: Observable<boolean> = of(true);

  clubLocation: google.maps.LatLngLiteral = { lat: 42.982618, lng: -81.261501 };
  mapOptions: google.maps.MapOptions = {
    center: this.clubLocation,
    zoom: 16,
    mapTypeControl: false,
  };
  markerOptions: google.maps.MarkerOptions = {
    position: this.clubLocation,
    icon: '../../../assets/lcc-logo-black.png',
  }
 
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.resizeMap(window.innerWidth);
  }

  constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.resizeMap(window.innerWidth);
    this.isMapLoaded$ = this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMaps.apiKey}`, 
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  onNavigate(path: NavPathTypes): void {
    this.router.navigate([path]);
  }

  private resizeMap(screenWidthPx: number): void {
    if (screenWidthPx > 860) {
      this.mapHeight = '400px';
      this.mapWidth = '620px';
    } else if (screenWidthPx >= 700) {
      this.mapHeight = `${window.innerWidth - 460}px`;
      this.mapWidth = `${window.innerWidth - 240}px`;
    } else if (screenWidthPx >= 500) {
      this.mapHeight = '240px';
      this.mapWidth = `${window.innerWidth - 140}px`;
    } else if (screenWidthPx >= 350) {
      this.mapHeight = '200px';
      this.mapWidth = `${window.innerWidth - 110}px`;
    } else {
      this.mapHeight = '180px';
      this.mapWidth = '250px';
    }
  }
}
