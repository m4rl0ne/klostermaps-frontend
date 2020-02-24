import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

declare var $: any;
declare var L: any;

@Component({
  selector: 'app-event-create-or-update',
  templateUrl: './event-create-or-update.component.html',
  styleUrls: ['./event-create-or-update.component.scss']
})
export class EventCreateOrUpdateComponent implements OnInit {

  step:number = 1;

  firstStepModel: any = {};

  leafletMap: any;
  maps: any;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    $(".search.selection.dropdown").dropdown();

    this.mapService.getAllMaps().subscribe(res => {
      //@ts-ignore
      this.maps = res.maps;
    });
  }

  initMap() {
    let that = this;
    this.leafletMap = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2
    });

    var bounds = [[0,0], [1000,1000]];
    var image = L.imageOverlay('http://localhost:5000/api/maps/' + this.firstStepModel.mapFileName, bounds).addTo(this.leafletMap);

    this.leafletMap.fitBounds(bounds);

    var editableLayers = new L.FeatureGroup();
    this.leafletMap.addLayer(editableLayers);

    delete L.Icon.Default.prototype._getIconUrl;
    // @ts-ignore
    L.Icon.Default.mergeOptions({
      // @ts-ignore
      iconRetinaUrl: require("../../../../../../node_modules/leaflet/dist/images/marker-icon-2x.png"),
      // @ts-ignore
      iconUrl: require("../../../../../../node_modules/leaflet/dist/images/marker-icon.png"),
      // @ts-ignore
      shadowUrl: require("../../../../../../node_modules/leaflet/dist/images/marker-shadow.png")
    // @ts-ignore
    });

    var options = {
      position: 'topleft',
      draw: {
          polygon: false,
          circle: false,
          rectangle: false,
          circlemarker: false
      },
      edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: true
      }
    }
  };

  nextStep() {
    this.step += 1;

    if(this.step == 2) {
      this.initMap();
    }
  }

  previousStep() {
    this.step -= 1;
  }
  

}
