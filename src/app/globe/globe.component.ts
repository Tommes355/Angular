import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Globe from 'globe.gl';

interface CountryProperties {
  name?: string;
  pop_est?: number;
}

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements AfterViewInit {
  @ViewChild('globeContainer') globeContainer!: ElementRef;
  globe: any;
  highlightedCountry: any = null;

  constructor() { }

  ngAfterViewInit() {
    this.initializeGlobe();
  }

  initializeGlobe() {
    this.globe = Globe()
      (this.globeContainer.nativeElement)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .polygonsData([])
      .polygonAltitude(0.01)
      .polygonCapColor(() => 'rgba(200, 0, 0, 0)')
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.1)')
      .polygonStrokeColor(() => '#111')
      .onPolygonClick((polygon) => this.highlightCountry(polygon));

    // Laden der GeoJSON-Daten für Europa und die USA
    fetch('assets/geojson/europe_usa.geo.json')
      .then(res => res.json())
      .then(data => {
        console.log('GeoJSON data loaded:', data);
        if (data.features) {
          this.globe
            .polygonsData(data.features)
            .polygonLabel(({ properties }: { properties: CountryProperties }) => `
              <b>${properties.name || 'Unknown'}</b>
              <br />
              Population: <i>${properties.pop_est ? properties.pop_est.toLocaleString() : 'N/A'}</i>
            `);
        } else {
          console.error('Invalid GeoJSON format:', data);
        }
      })
      .catch(err => console.error('Error loading GeoJSON data:', err));
  }

  highlightCountry(polygon: any) {
    // Überprüfe, ob polygon und polygon.__data definiert sind
    if (!polygon || !polygon.__data) {
      console.error('Invalid polygon data:', polygon);
      return;
    }

    // Überprüfe die Struktur der polygon.__data
    console.log('Polygon data:', polygon.__data);

    // Setze den Standardwert für die Hervorhebung zurück
    if (this.highlightedCountry) {
      console.log('Removing highlight from:', this.highlightedCountry);
      this.highlightedCountry.__data.polygonAltitude = 0.01; // Setze den Altitude-Wert zurück
      this.highlightedCountry.__data.polygonCapColor = 'rgba(200, 0, 0, 0)'; // Setze die Farbe zurück
    }

    // Hervorhebung des aktuellen Polygons
    console.log('Highlighting:', polygon);
    if (polygon.__data) {
      polygon.__data.polygonAltitude = 0.1; // Erhöhe die Höhe für das Highlighting
      polygon.__data.polygonCapColor = 'rgba(255, 165, 0, 0.6)'; // Setze die Farbe für das Highlighting
    } else {
      console.error('No __data found on polygon');
    }

    this.highlightedCountry = polygon;

    // Aktualisiere die Globe-Daten, um die Hervorhebung zu reflektieren
    this.globe
      .polygonsData([...this.globe.polygonsData()]);
  }
}
