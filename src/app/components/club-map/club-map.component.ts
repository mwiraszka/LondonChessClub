import { Loader } from '@googlemaps/js-api-loader';

import { Component, ElementRef, OnInit } from '@angular/core';

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
})
export class ClubMapComponent implements OnInit {
  private clubLocation: google.maps.LatLngLiteral = { lat: 42.982546, lng: -81.261387 };
  private loader!: Loader;
  private mapOptions: google.maps.MapOptions = {
    center: this.clubLocation,
    mapId: 'club-map',
    mapTypeControl: false,
    zoom: 15,
  };

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
    });

    this.initMap();
  }

  private async initMap(): Promise<void> {
    const mapElement: HTMLDivElement =
      this.elementRef.nativeElement.querySelector('#club-map');
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
