import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.js';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base.service.js';

declare var $: any;
declare var L: any;

@Component({
  selector: 'app-map-create-or-update',
  templateUrl: './map-create-or-update.component.html',
  styleUrls: ['./map-create-or-update.component.scss']
})
export class MapCreateOrUpdateComponent implements OnInit {

  @ViewChild('firstStep',null) firstStepForm: NgForm;
  @ViewChild('secondStep',null) secondStepForm: NgForm;

  /**
   * Navigation
   */
  step: number = 1;

  /**
   * Form & input
   */
  nameIsValid: boolean;

  firstStepModel: any = {};
  secondStepModel: any = {};

  /**
   * Leaflet map
   */
  map: any;

  mapId: string;
  mapFileName: string;

  markers: any = [];
  polylines: any = [];

  files: File[] = [];
  imageDimensions: any = {};

  /**
   * Map detail modal
   */
  showMapDetailModal: boolean = false;
  mapDetailMode: any;
  mapDetailTitle: string;
  mapDetailHeader: string;
  maps: any;
  originMarker: any;

  constructor(private mapService: MapService, private router: Router, private mapsService: MapService, private baseService: BaseService) { }

  ngOnInit() {
  }

  checkNameExists() {
    this.mapService.nameExists(this.firstStepModel.name.trim()).subscribe(res => {
      if(res.res) {
        this.nameIsValid = false;
        this.firstStepForm.form.controls["name"].setErrors({'exists': true});
      }else {
        this.nameIsValid = true;
      }
    })
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
    
    this.mapService.uploadMap(this.files).subscribe(res => {
      this.firstStepModel.mapFileName = res.fileName;
      this.firstStepForm.controls["mapFileName"].markAsTouched();

      this.imageDimensions.width = res.dimensions.width;
      this.imageDimensions.height = res.dimensions.height;
    }, error => {
      alert(error);
    });
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  initMap() {
    let that = this;
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2
    });

    this.mapService.getAllMaps().subscribe(res => {
      this.maps = res;
    }, error => {
      console.log(error);
    });

    let bounds = [[0,0], [this.imageDimensions.height,this.imageDimensions.width]];
    L.imageOverlay(this.baseService.baseUrl + '/maps/' + this.firstStepModel.mapFileName, bounds).addTo(this.map);

    this.map.fitBounds(bounds);

    let editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

    let blueIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    let options = {
      position: 'topleft',
      draw: {
          polygon: false,
          circle: false,
          rectangle: false,
          circlemarker: false,
          marker: {
            icon: blueIcon
          }
      },
      edit: {
          featureGroup: editableLayers, //REQUIRED!!
          remove: true
      }
    };

    let drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, function (e) {
      let roomType = e.layerType, layer = e.layer;

      if (roomType === 'marker') {
        layer.setIcon(blueIcon);

        let markerId = that.markers.length;
        layer.bindPopup('<div class="ui form"> <div class="grouped fields typeFields"><label>Typ</label>'+
          '<div class="field"><div class="ui radio checkbox" data-roomType="room"><input type="radio" name="marker" checked="checked"><label>Raum</label></div></div>'+
          '<div class="field"><div class="ui radio checkbox" data-roomType="stairway"><input type="radio" name="marker"><label>Treppenhaus</label></div></div>' +
          '<div class="field"><div class="ui fluid button selectExitBtn">Ausgang wählen</div></div></div></div>');
        that.markers.push({id: markerId, position: layer.getLatLng(), roomType: 'room'});

        layer.on("popupopen", (e) => {
          if(that.markers[markerId].roomType == "room") {
            $(".typeFields .radio.checkbox:eq(0)").checkbox("check")
            $(".selectExitBtn").hide();

          }else if(that.markers[markerId].roomType == "stairway"){
            $(".typeFields .radio.checkbox:eq(1)").checkbox("check")
            if(that.maps.maps.length > 0) {
              $(".selectExitBtn").show();
            }
          }

          // add change handler for checkbox
          $(".typeFields .radio.checkbox").checkbox({
            onChecked: (e) => {
              that.markers[markerId].roomType = $(".grouped.fields.typeFields .checked")[0].dataset.roomtype;
              if(that.markers[markerId].roomType == "stairway" && that.maps.maps.length > 0) {
                $(".selectExitBtn").show();
              }else {
                $(".selectExitBtn").hide();
              }
            }
          });

          if(that.maps.maps.length > 0) {
            $(".selectExitBtn").click(() => {
              if(that.markers[markerId].roomType == "stairway") {
                that.markers[markerId].stairwayDetails = { exitId: null, direction: null, targetMapId: null };
                that.showMapDetailModal = true;

                that.originMarker = that.markers[markerId];
                that.mapDetailTitle = "Ebenen verbinden";
                that.mapDetailHeader = "Bitte wählen Sie eine Karte und dann den Ausgang des Treppenhauses an, der die beiden Ebenen verbindet.";
              }
            });
          }

        });

      }else if(roomType === 'polyline') {
        that.polylines.push({id: '', nodes: layer.getLatLngs()});
      }

      editableLayers.addLayer(layer);
      if(roomType === 'marker') that.markers[that.markers.length - 1].id = layer._leaflet_id;
      if(roomType === 'polyline') that.polylines[that.polylines.length -1].id = layer._leaflet_id;
    });

    this.map.on(L.Draw.Event.DELETED, function(e) {
      for(let layerId in e.layers._layers) {
        if(that.markers.findIndex(x => x.id == layerId) != -1) that.markers.splice(that.markers.findIndex(x => x.id == layerId), 1);
        if(that.polylines.findIndex(x => x.id == layerId) != -1) that.polylines.splice(that.polylines.findIndex(x => x.id == layerId), 1);
      }
    });
  }

  mapDetailClose(event) {
    this.showMapDetailModal = false;

    console.log("Event:");
    console.log(event);

    if((typeof event == "boolean" && event == false) || (!event.targetMapId || !event.direction || !event.target.id)) {
      let redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // check if stairway markers have no exit id assigned which is neccessary to proceeds
      this.markers.forEach(marker => {
        this.map.eachLayer(layer => {
          if((layer._leaflet_id == marker.id && marker.stairwayDetails.exitId === null) || (layer._leaflet_id == marker.id && (!event.targetMapId || !event.direction || !event.target.id))) {
            layer.setIcon(redIcon);

            //disable form!
          }
        })
      });

    } else {
      let greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      this.markers.forEach(marker => {
        if(marker && event.origin && marker.id == event.origin.id) {
          marker.stairwayDetails.targetMapId = event.targetMapId;
          marker.stairwayDetails.direction = event.direction;
          marker.stairwayDetails.exitId = event.target.id;

          this.map.eachLayer(layer => {
            if(layer._leaflet_id == marker.id && marker.stairwayDetails.exitId !== null) {
              layer.setIcon(greenIcon);
            }
          });
        }
      })
    }

    console.log(this.markers);
  }

  nextStep() {
    //check name
    if(this.step == 1 && this.nameIsValid === false){
      this.mapService.nameExists(this.firstStepModel.name.trim()).subscribe(res => {
        if(res.res) {
          this.nameIsValid = false;
          this.firstStepForm.form.controls["name"].setErrors({'exists': true});
        }else {
          this.step += 1;
        }
      })
    }else {
      this.step += 1;
    }
  
    if(this.step == 2) {
      setTimeout(() => {
        this.initMap();
      }, 100)
    }
  }

  previousStep() {
    this.step -= 1;
  }
  
  createOrEditMap() {
    // Daten aufbereiten
    let mapCreateOrEditModel = {
      name: this.firstStepModel.name,
      description: this.firstStepModel.description,
      mapFileName: this.firstStepModel.mapFileName,
      markers: this.markers,
      polylines: this.polylines
    }

    $(".ui.dimmer").addClass("active");

    this.mapsService.createOrEditMap(mapCreateOrEditModel).subscribe(res => {
      $(".ui.dimmer").removeClass("active");
      this.router.navigate(["admin/map"]);
    }, error => {
      console.log(error);
    });
  }

}
