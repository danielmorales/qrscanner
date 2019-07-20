import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  lat: number;
  lng: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    let geo: any = this.route.snapshot.paramMap.get('geo');
    // console.log(geo);

    geo = geo.substr(4);
    geo = geo.split(',');

    this.lat = Number(geo [0]);
    this.lng = Number(geo [1]);

    console.log(this.lat, this.lng);
  }

  ngAfterViewInit() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaW1vcmFsZXMiLCJhIjoiY2p5YWh1ejZ5MDF4cTNtczMwZzY5Y2FldyJ9.1EcMXEUa23BdmAZ_J4k1oA';

    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
      });


    // tslint:disable-next-line: only-arrow-functions
    map.on ('load', () => {

      map.resize();

      new mapboxgl.Marker()
        .setLngLat([this.lng, this.lat])
        .addTo(map);


        // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      let labelLayerId;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer({
        // tslint:disable-next-line: object-literal-key-quotes
        'id': '3d-buildings',
        // tslint:disable-next-line: object-literal-key-quotes
        'source': 'composite',
        // tslint:disable-next-line: object-literal-key-quotes
        'source-layer': 'building',
        // tslint:disable-next-line: object-literal-key-quotes
        'filter': ['==', 'extrude', 'true'],
        // tslint:disable-next-line: object-literal-key-quotes
        'type': 'fill-extrusion',
        // tslint:disable-next-line: object-literal-key-quotes
        'minzoom': 15,
        // tslint:disable-next-line: object-literal-key-quotes
        'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
        'interpolate', ['linear'], ['zoom'],
        15, 0,
        15.05, ['get', 'heigh']
        ],
        'fill-extrusion-base': [
        'interpolate', ['linear'], ['zoom'],
        15, 0,
        15.05, ['get', 'min_height']
        ],
        'fill-extrusion-opacity': .6
        }
        }, labelLayerId);
        });
  }



}
