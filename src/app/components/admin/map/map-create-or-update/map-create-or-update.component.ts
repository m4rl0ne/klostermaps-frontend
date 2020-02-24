import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.js';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

  step: number = 1;

  nameIsValid: boolean;

  map: any;

  mapId: string;
  mapFileName: string;

  firstStepModel: any = {};
  secondStepModel: any = {};

  markers: any = [];
  polylines: any = [];

  files: File[] = [];

  constructor(private mapService: MapService, private router: Router, private mapsService: MapService) { }

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
    });
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  initMap() {
    let that = this;
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -2
    });

    var bounds = [[0,0], [1000,1000]];
    var image = L.imageOverlay('http://localhost:5000/api/maps/' + this.firstStepModel.mapFileName, bounds).addTo(this.map);

    this.map.fitBounds(bounds);

    var editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);

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
  };

  var drawControl = new L.Control.Draw(options);
  this.map.addControl(drawControl);

  this.map.on(L.Draw.Event.CREATED, function (e) {
    var roomType = e.layerType, layer = e.layer;

    if (roomType === 'marker') {
      let markerId = that.markers.length;
      layer.bindPopup('<div class="ui form"> <div class="grouped fields"><label>Typ</label>'+
        '<div class="field"><div class="ui radio checkbox" data-roomType="room"><input type="radio" name="marker" checked="checked"><label>Raum</label></div></div>'+
        '<div class="field"><div class="ui radio checkbox" data-roomType="stairway"><input type="radio" name="marker"><label>Treppenhaus</label></div></div></div></div>');
      that.markers.push({id: markerId, position: layer.getLatLng(), roomType: 'room'});

      layer.on("popupopen", (e) => {
        if(that.markers[markerId].roomType == "room") {
          $(".radio.checkbox:eq(0)").checkbox("check")

        }else if(that.markers[markerId].roomType == "stairway"){
          $(".radio.checkbox:eq(1)").checkbox("check")
        }

        //add change handler for checkbox
        $(".radio.checkbox").checkbox({
          onChecked: (e) => {
            that.markers[markerId].roomType = $(".grouped.fields .checked")[0].dataset.roomtype;
          }
        })
      })
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
