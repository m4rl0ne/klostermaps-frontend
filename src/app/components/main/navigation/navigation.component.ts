import { Component, OnInit, Input } from '@angular/core';

declare var L: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @Input('directions') directions: any;

  leafletMap: any;

  constructor() { 
  }

  ngOnInit() {
    this.leafletMap = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 1
    });

    var bounds = [[0,0], [1000,1000]];
    L.imageOverlay('http://localhost:5000/api/maps/' + this.directions[0].mapFileName, bounds).addTo(this.leafletMap);
    this.leafletMap.fitBounds(bounds);

    // draw Polyline from directions
  }

}
