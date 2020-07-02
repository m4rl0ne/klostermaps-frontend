import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

declare var $: any;
declare var L: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @Input('directions') directions: any;

  leafletMap: any;
  currentOverlay: any;
  step: number = 0;

  constructor(private baseService: BaseService) { 
  }

  ngOnInit() {
    
    /**
     * Init map
     */
    this.leafletMap = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 1
    });

    /**
     * Add directions to map
     */
    if(Object.keys(this.directions).length == 1) {
      this.stepNavigation(0);
    } else {
      /**
       * multiple steps needed to get to direction
       */
      $("#finishedBtn").hide();
      $("#nextStepBtn").show();

      this.stepNavigation(this.step);
    }

  }

  stepIncrement() {
    this.step++;
    this.stepNavigation(this.step);
    if(this.step == Object.keys(this.directions).length -1) {
      $("#finishedBtn").show();
      $("#nextStepBtn").hide();
    }
  }

  stepNavigation(index: any) {

    let step = this.directions[index];

    var bounds = [[0,0], [step.dimensions.height, step.dimensions.width]];
    if(this.currentOverlay) {
      this.leafletMap.eachLayer(layer => {
        this.leafletMap.removeLayer(layer);
      });
    }
    this.currentOverlay = L.imageOverlay(this.baseService.baseUrl + '/maps/' + step.mapFileName, bounds).addTo(this.leafletMap);
    this.leafletMap.fitBounds(bounds);

    /**
     * Add Polyline
     */
    let polylinePoints = [];
    for(let point of step.polyline) {
      polylinePoints.push(new L.LatLng(point.lat, point.lng));
    }

    let polylineToAdd = new L.Polyline(polylinePoints, {
      color: 'blue',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    });

    polylineToAdd.addTo(this.leafletMap);

    /**
     * Polyline decorator (arrows)
     */
    let arrowHead = L.polylineDecorator(polylineToAdd, {
      patterns: [
        { offset: 25, repeat: 100, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true }}) }
      ]
    }).addTo(this.leafletMap);

    /**
     * Add Markers (start/goal)
     */

    let blueIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    for(let marker of step.markers) {
      new L.Marker([marker.lat, marker.lng], { title: marker.flag == "stairway" ? null : marker.flag })
        .bindTooltip(marker.flag == "stairway" ? "Treppenhaus" : marker.flag, { 
          permanent: true,
          direction: 'right',
          opacity: 1
        })
        .setIcon(blueIcon)
        .addTo(this.leafletMap);
    }
  }

  finishNavigation() {
    $(".ui.dimmer").addClass("active");
    window.location.reload();
  }

}
