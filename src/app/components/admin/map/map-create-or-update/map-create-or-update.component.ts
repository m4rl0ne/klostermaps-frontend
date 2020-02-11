import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import '../../../../../../node_modules/leaflet-draw/dist/leaflet.draw.js';
import { Router } from '@angular/router';

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

  map: any;

  mapId: string;
  mapFileName: string;

  firstStepModel: any = {};
  secondStepModel: any = {};

  markers: any = [];
  polylines: any = [];

  files: File[] = [];

  constructor(private mapService: MapService, private router: Router) { }

  ngOnInit() {}

  onSelect(event) {
    //console.log(event);
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

  nextStep() {
    this.step += 1;

    if(this.step == 2) {
      setTimeout(() => {
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
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require("../../../../../../node_modules/leaflet/dist/images/marker-icon-2x.png"),
          iconUrl: require("../../../../../../node_modules/leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("../../../../../../node_modules/leaflet/dist/images/marker-shadow.png")
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
        var type = e.layerType, layer = e.layer;
  
        if (type === 'marker') {
          let markerId = that.markers.length;
          layer.bindPopup('<div class="ui form"> <div class="grouped fields"><label>Typ</label>'+
            '<div class="field"><div class="ui radio checkbox" data-type="room"><input type="radio" name="marker" checked="checked"><label>Raum</label></div></div>'+
            '<div class="field"><div class="ui radio checkbox" data-type="stairway"><input type="radio" name="marker"><label>Treppenhaus</label></div></div></div></div>');
          that.markers.push({id: markerId, position: layer.getLatLng(), type: 'room'});
  
          layer.on("popupopen", (e) => {
            if(that.markers[markerId].type == "room") {
              $(".radio.checkbox:eq(0)").checkbox("check")
  
            }else if(that.markers[markerId].type == "stairway"){
              $(".radio.checkbox:eq(1)").checkbox("check")
            }
  
            //add change handler for checkbox
            $(".radio.checkbox").checkbox({
              onChecked: () => {
                that.markers[markerId].type = $(".grouped.fields .checked")[0].dataset.type;
              }
            })
          })
        }else if(type === 'polyline') {
          that.polylines.push({id: '', nodes: layer.getLatLngs()});
        }
  
        editableLayers.addLayer(layer);
        if(type === 'marker') that.markers[that.markers.length - 1].id = layer._leaflet_id;
        if(type === 'polyline') that.polylines[that.polylines.length -1].id = layer._leaflet_id;
      });
  
      this.map.on(L.Draw.Event.DELETED, function(e) {
        for(let layerId in e.layers._layers) {
          if(that.markers.findIndex(x => x.id == layerId) != -1) that.markers.splice(that.markers.findIndex(x => x.id == layerId), 1);
          if(that.polylines.findIndex(x => x.id == layerId) != -1) that.polylines.splice(that.polylines.findIndex(x => x.id == layerId), 1);
        }
      });
      }, 10)
    }
  }

  previousStep() {
    this.step -= 1;
  }

  onSubmit() {
    alert("SAVED");

    // Daten aufbereiten
    let postData = {
      name: this.firstStepModel.name,
      description: this.firstStepModel.description,
      mapFileName: this.firstStepModel.mapFileName,
      markers: this.markers,
      polylines: this.polylines
    }

    console.log(postData);

    // POST DATA TO BACKEND
    // this.mapsService.createMap(postData);

    this.router.navigate(["admin"]);
  }

}
