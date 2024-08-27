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




// import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// import Globe from 'globe.gl';

// interface CountryProperties {
//   name?: string;
//   pop_est?: number;
// }

// @Component({
//   selector: 'app-globe',
//   templateUrl: './globe.component.html',
//   styleUrls: ['./globe.component.scss']
// })
// export class GlobeComponent implements AfterViewInit {
//   @ViewChild('globeContainer') globeContainer!: ElementRef;
//   globe: any;
//   highlightedCountry: any = null;

//   constructor() { }

//   ngAfterViewInit() {
//     this.initializeGlobe();
//   }

//   initializeGlobe() {
//     this.globe = Globe()
//       (this.globeContainer.nativeElement)
//       .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
//       .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
//       .polygonsData([])
//       .polygonAltitude(0.01)
//       .polygonCapColor(() => 'rgba(200, 0, 0, 0)')
//       .polygonSideColor(() => 'rgba(0, 100, 0, 0.1)')
//       .polygonStrokeColor(() => '#111')
//       .onPolygonClick((polygon) => this.highlightCountry(polygon));

//     // Laden der GeoJSON-Daten für Europa und die USA
//     fetch('assets/geojson/europe_usa.geo.json')
//       .then(res => res.json())
//       .then(data => {
//         console.log('GeoJSON data loaded:', data);
//         if (data.features) {
//           this.globe
//             .polygonsData(data.features)
//             .polygonLabel(({ properties }: { properties: CountryProperties }) => `
//               <b>${properties.name || 'Unknown'}</b>
//               <br />
//               Population: <i>${properties.pop_est ? properties.pop_est.toLocaleString() : 'N/A'}</i>
//             `);
//         } else {
//           console.error('Invalid GeoJSON format:', data);
//         }
//       })
//       .catch(err => console.error('Error loading GeoJSON data:', err));
//   }

//   highlightCountry(polygon: any) {
//     // Überprüfe, ob polygon und polygon.__data definiert sind
//     if (!polygon || !polygon.__data) {
//       console.error('Invalid polygon data:', polygon);
//       return;
//     }

//     // Überprüfe die Struktur der polygon.__data
//     console.log('Polygon data:', polygon.__data);

//     // Setze den Standardwert für die Hervorhebung zurück
//     if (this.highlightedCountry) {
//       console.log('Removing highlight from:', this.highlightedCountry);
//       this.highlightedCountry.__data.polygonAltitude = 0.01; // Setze den Altitude-Wert zurück
//       this.highlightedCountry.__data.polygonCapColor = 'rgba(200, 0, 0, 0)'; // Setze die Farbe zurück
//     }

//     // Hervorhebung des aktuellen Polygons
//     console.log('Highlighting:', polygon);
//     if (polygon.__data) {
//       polygon.__data.polygonAltitude = 0.1; // Erhöhe die Höhe für das Highlighting
//       polygon.__data.polygonCapColor = 'rgba(255, 165, 0, 0.6)'; // Setze die Farbe für das Highlighting
//     } else {
//       console.error('No __data found on polygon');
//     }

//     this.highlightedCountry = polygon;

//     // Aktualisiere die Globe-Daten, um die Hervorhebung zu reflektieren
//     this.globe
//       .polygonsData([...this.globe.polygonsData()]);
//   }
// }


// ################################################################################

// import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
// import Globe from 'globe.gl'; // Make sure this import matches the actual module import
// import { GeoJsonFeature, GeoJsonProperties } from 'geojson';

// @Component({
//   selector: 'app-globe',
//   templateUrl: './globe.component.html',
//   styleUrls: ['./globe.component.scss']
// })
// export class GlobeComponent implements AfterViewInit {
//   @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;
//   private world: any; // Define the type if necessary based on the library's type definitions

//   ngAfterViewInit(): void {
//     this.initializeGlobe();
//   }

//   initializeGlobe(): void {
//     this.world = Globe()
//       (this.globeContainer.nativeElement)
//       .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
//       .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
//       .backgroundColor('rgba(0,0,0,0)')
//       .showAtmosphere(true)
//       .atmosphereColor('#3a228a')
//       .atmosphereAltitude(0.25)
//       .polygonCapColor(() => 'rgba(255, 255, 255, 0.1)')
//       .polygonStrokeColor(() => '#111')
//       .polygonLabel(({ properties }: { properties: GeoJsonProperties }) => {
//         return `
//           <div class="tooltip">
//             <b>${properties.name}</b>
//           </div>
//         `;
//       })
//       .onPolygonHover((polygon: object | null, prevPolygon: object | null) => {
//         const hoverD = polygon as GeoJsonFeature | null;
//         const prevD = prevPolygon as GeoJsonFeature | null;
//         this.highlightCountry(hoverD, prevD);
//       })
//       .onPolygonClick((polygon: object, event: MouseEvent, coords: { lat: number; lng: number; altitude: number; }) => {
//         const clickD = polygon as GeoJsonFeature;
//         this.highlightCountry(clickD);
//       });

//     fetch('assets/geojson/europe_usa.geo.json')
//       .then(res => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then((data: { features: GeoJsonFeature[] }) => {
//         console.log('GeoJSON Data:', data); // Log data for debugging
//         this.world.polygonsData(data.features);
//       })
//       .catch(err => console.error('Error loading countries data:', err));
//   }

//   highlightCountry(feature: GeoJsonFeature | null, prevFeature?: GeoJsonFeature | null): void {
//     if (feature) {
//       const countryId = feature.id as string;
//       this.world
//         .polygonCapColor(d => d.id === countryId ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)');
//     }
//     if (prevFeature && prevFeature !== feature) {
//       const prevCountryId = prevFeature.id as string;
//       this.world
//         .polygonCapColor(d => d.id === prevCountryId ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)');
//     }
//   }
// }
