import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { NgForm } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';

declare var $: any;
declare var L: any;

@Component({
  selector: 'app-event-create-or-update',
  templateUrl: './event-create-or-update.component.html',
  styleUrls: ['./event-create-or-update.component.scss']
})
export class EventCreateOrUpdateComponent implements OnInit {

  @ViewChild('firstStep',null) firstStepForm: NgForm;
  @ViewChild('secondStep',null) secondStepForm: NgForm;

  firstStepModel: any = {};
  secondStepModel: any = {};

  step: number = 1;

  leafletMap: any;
  maps: any;
  totalNumOfMarkers: number;

  keywords: any = [];

  mapInit: boolean = false;
  currentOverlay: any;

  /**
   * This is some strange bug, somehow *ngFor cannot read the keywords array but can read the serialized JSON array
   */
  JSON;
  constructor(
    private mapService: MapService, 
    private eventService: EventService,
    private router: Router,
    private baseService: BaseService) { 
    this.JSON = JSON;
  }

  ngOnInit() {
    $(".dropdown").dropdown();
    $(".search.selection.dropdown").dropdown({
      onChange: (mapFileName) => {
        this.mapInit = true;

        if(this.currentOverlay) {
          this.leafletMap.removeLayer(this.currentOverlay);
        }

        var bounds = [[0,0], [1000,1000]];
        L.imageOverlay(this.baseService.baseUrl + '/maps/' + mapFileName, bounds).addTo(this.leafletMap);
        this.leafletMap.fitBounds(bounds);

        let redIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        let greenIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        //add all markers
        let map = this.maps.find(x => x.mapFileName == mapFileName);
        let markerArray = [];
        for(let marker of map.markers) {
          let popup = L.popup({className: 'large-popup', width: '500px'});
          popup.setContent('<div class="container"><div class="ui form"><div class="field"><label>Name</label><div class="ui input"><input type="text" placeholder="Name" id="key-' + marker.id + '"></div></div></div></div>');
          let lMarker = new L.marker([marker.position.lat,marker.position.lng]).bindPopup(popup);
          lMarker.id = marker.id;

          let keyword = this.keywords.find(x => x.pos == marker.id);

          if(keyword && keyword.key != "") {
            lMarker.setIcon(greenIcon);
          }else {
            lMarker.setIcon(redIcon);
          }

          markerArray.push(lMarker);
        }

        this.currentOverlay = L.featureGroup(markerArray).addTo(this.leafletMap);        

        this.currentOverlay.on("popupopen", (e) => {
          //load values into fields
          let keyword = this.keywords.find(x => x.pos == e.layer.id);
          $("#key-" + e.layer.id)[0].value = keyword ? keyword.key : '';
        })

        this.currentOverlay.on("popupclose", (e) => {
          //save values to array
          let keyword = this.keywords.find(x => x.pos == e.layer.id);
          if(! keyword) {
            this.keywords.push({
              key: $("#key-" + e.layer.id)[0].value,
              map: map._id,
              pos: e.layer.id
            });
          }else {
            keyword.key = $("#key-" + e.layer.id)[0].value;
          }

          if($("#key-" + e.layer.id)[0].value != "") {
            e.layer.setIcon(greenIcon);
          }else {
            e.layer.setIcon(redIcon);
          }

          // enable continue button
          this.secondStepModel.keywords = JSON.stringify(this.keywords);
          this.secondStepForm.controls["keywords"].markAsTouched();
        });
      }
    });

    $('.message .close')
      .on('click', function() {
        $(this)
          .closest('.message')
          .transition('fade')
        ;
      })
    ;

    this.mapService.getAllMaps().subscribe(res => {
      //@ts-ignore
      this.maps = res.maps;

      this.maps.forEach((map, mapIndex) => {
        map.markers.forEach((marker, markerIndex) => {
          if(marker.roomType == "stairway") {
            this.maps[mapIndex].markers.splice(markerIndex, 1);
          }
        })
      });

      let result = 0;
      for(let map of this.maps) {
        result += map.markers.length;
      }
      this.totalNumOfMarkers = result;
    });
  }

  getMapForId(mapId) {
    return this.maps.find(x => x._id == mapId).name;
  }

  nextStep() {
    this.step += 1;

    if(this.step == 2) {
      this.leafletMap = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 1
      });
    }else {
    }
  }

  previousStep() {
    this.step -= 1;
  }

  createOrEditEvent() {
    // POST DATA

    let eventCreateOrEditModel = {
      name: this.firstStepModel.name,
      description: this.firstStepModel.description,
      keywords: this.keywords
    };

    $(".ui.dimmer").addClass("active");

    this.eventService.createOrEditEvent(eventCreateOrEditModel).subscribe(res => {
      $(".ui.dimmer").removeClass("active");
      this.router.navigate(["admin/event"]);
    })
  }
}
