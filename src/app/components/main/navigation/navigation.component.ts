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

    var bounds = [[0,0], [this.directions[0].dimensions.height,this.directions[0].dimensions.width]];
    L.imageOverlay(this.baseService.baseUrl + '/maps/' + this.directions[0].mapFileName, bounds).addTo(this.leafletMap);
    this.leafletMap.fitBounds(bounds);

    /**
     * Add directions to map
     */
    if(Object.keys(this.directions).length == 1) {
      let step = this.directions[0];

      /**
       * Add Polyline
       */
      let polylinePoints = [];
      for(let point of step.polyline) {
        polylinePoints.push(new L.LatLng(point.lat, point.lng));
      }

      let polylineToAdd = new L.Polyline(polylinePoints, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
      });

      polylineToAdd.addTo(this.leafletMap);

      /**
       * Add Markers (start/goal)
       */

      delete L.Icon.Default.prototype._getIconUrl;
      // @ts-ignore
      L.Icon.Default.mergeOptions({
        // @ts-ignore
        iconRetinaUrl: require("../../../../../node_modules/leaflet/dist/images/marker-icon-2x.png"),
        // @ts-ignore
        iconUrl: require("../../../../../node_modules/leaflet/dist/images/marker-icon.png"),
        // @ts-ignore
        shadowUrl: require("../../../../../node_modules/leaflet/dist/images/marker-shadow.png")
      // @ts-ignore
      });

      for(let marker of step.markers) {
        new L.Marker([marker.lat, marker.lng], { title: marker.flag }).addTo(this.leafletMap);
      }
    } else {
      /**
       * multiple steps needed to get to direction
       */
      $("#finishedBtn").hide();
      $("#nextStepBtn").show();
    }

  }

  finishNavigation() {
    $(".ui.dimmer").addClass("active");
    window.location.reload();
  }

}
