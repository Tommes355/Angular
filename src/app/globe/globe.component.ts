import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import Globe from 'globe.gl';

// Define types for GeoJSON if not available from the module
interface GeoJsonProperties {
  [key: string]: any;
}

interface GeoJsonFeature {
  type: string;
  id: string;
  properties: GeoJsonProperties;
  geometry: {
    type: string;
    coordinates: any;
  };
}

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements AfterViewInit {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
  private world: any;

  ngAfterViewInit(): void {
    this.initializeGlobe();
  }

  initializeGlobe(): void {
    this.world = Globe()
      (this.globeContainer.nativeElement)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor('#3a228a')
      .atmosphereAltitude(0.25)
      .polygonCapColor(() => 'rgba(255, 255, 255, 0.1)')
      .polygonStrokeColor(() => '#111')
      .polygonLabel((d: any) => {
        if (d.properties && d.properties.name) {
          return `
            <div class="tooltip">
              <b>${d.properties.name}</b>
            </div>
          `;
        }
        return '';
      })
      .onPolygonHover((polygon: any, prevPolygon: any) => {
        this.highlightCountry(polygon, prevPolygon);
      })
      .onPolygonClick((polygon: any, event: MouseEvent, coords: { lat: number; lng: number; altitude: number; }) => {
        this.highlightCountry(polygon);
      });

    fetch('assets/geojson/europe_usa.geo.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: { features: GeoJsonFeature[] }) => {
        console.log('GeoJSON Data:', data); // Log data for debugging
        this.world.polygonsData(data.features);
      })
      .catch(err => console.error('Error loading countries data:', err));
  }

  highlightCountry(polygon: any, prevPolygon?: any): void {
    if (polygon) {
      const countryId = polygon.id;
      this.world
        .polygonCapColor((d: any) => d.id === countryId ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)');
    }
    if (prevPolygon && prevPolygon !== polygon) {
      const prevCountryId = prevPolygon.id;
      this.world
        .polygonCapColor((d: any) => d.id === prevCountryId ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)');
    }
  }
}

