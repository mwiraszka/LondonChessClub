import { Loader } from '@googlemaps/js-api-loader';

import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { environment } from '@env';

@Component({
  selector: 'lcc-club-map',
  template: '<div id="club-map"></div>',
  styles: `
    div {
      width: 100%;
      height: 230px;
    }
  `,
  imports: [CommonModule],
})
export class ClubMapComponent implements OnInit {
  @ViewChild('mapElement', { read: ElementRef }) mapElement: HTMLDivElement | null = null;

  private clubLocation: google.maps.LatLngLiteral = { lat: 42.982546, lng: -81.261387 };
  private loader!: Loader;
  private mapOptions: google.maps.MapOptions = {
    mapId: 'club-map',
    center: this.clubLocation,
    zoom: 15,
    mapTypeControl: false,
  };

  ngOnInit(): void {
    this.loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
    });

    if (this.mapElement) {
      this.initMap(this.mapElement);
    }
  }

  private async initMap(mapElement: HTMLDivElement): Promise<void> {
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
