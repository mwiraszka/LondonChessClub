import { Loader } from '@googlemaps/js-api-loader';

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

import { environment } from '@environments/environment';

@Component({
  selector: 'lcc-club-map',
  templateUrl: './club-map.component.html',
  styleUrls: ['./club-map.component.scss'],
})
export class ClubMapComponent implements OnInit {
  clubLocation: google.maps.LatLngLiteral = { lat: 42.982546, lng: -81.261387 };
  mapOptions: google.maps.MapOptions = {
    mapId: 'club-map',
    center: this.clubLocation,
    zoom: 15,
    mapTypeControl: false,
  };
  loader!: Loader;

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ngOnInit(): void {
    this.loader = new Loader({
      apiKey: environment.googleMaps.apiKey,
      version: 'weekly',
    });

    const mapElement = this._document.getElementById('club-map');
    if (mapElement) {
      this.initMap(mapElement);
    }
  }

  async initMap(mapElement: HTMLElement): Promise<void> {
    const map = await this.loader
      .importLibrary('maps')
      .then(({ Map }) => new Map(mapElement, this.mapOptions))
      .catch(error => console.error(`[LCC] Error creating Google Maps map: ${error}`));

    if (map) {
      this.loader
        .importLibrary('marker')
        .then(({ AdvancedMarkerElement }) => {
          new AdvancedMarkerElement({
            map,
            position: this.clubLocation,
          });
        })
        .catch(error =>
          console.error(`[LCC] Error creating Google Maps advanced marker: ${error}`),
        );
    }
  }
}
