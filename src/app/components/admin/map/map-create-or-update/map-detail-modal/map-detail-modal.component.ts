import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

declare var $: any;
declare var L: any;

@Component({
  selector: 'app-map-detail-modal',
  templateUrl: './map-detail-modal.component.html',
  styleUrls: ['./map-detail-modal.component.scss']
})
export class MapDetailModalComponent implements OnInit {

  @Input('mode') mode: any;
  @Input('title') title: any;
  @Input('header') header: any;
  @Input('maps') maps: any;
  @Input('mapToCreate') mapToCreateName: any;
  @Input('origin') origin: any;

  @Output() closed = new EventEmitter<any>();

  /**
   * Leaflet map
   */
  leafletMap: any;
  mapInit: boolean = false;
  currentOverlay: any;

  selectedMarker: any = {};

  constructor(private baseService: BaseService) { }

  ngOnInit() {
    console.log(this.maps);
    this.maps = this.maps.maps;

    let that = this;
    $(".ui.mapDetailModal").modal({
      onHide: () => {
        if(!that.selectedMarker || !that.selectedMarker.direction || that.selectedMarker.direction == null) {
          that.closed.emit(true);
        }
      },

      onApprove: () => {
        that.closed.emit(that.selectedMarker);
      }
    }).modal("show");

    $(".search.selection.dropdown").dropdown({
      onChange: (mapFileName) => {
        if(!this.mapInit) {
          this.mapInit = true;

          this.leafletMap = L.map('detailMap', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 1
          });
        }

        if(this.currentOverlay) {
          this.leafletMap.removeLayer(this.currentOverlay);
        }

        let dimensions;
        this.maps.forEach((map: { mapFileName: any; dimensions: any; }, mapIndex: any) => {
          if(map.mapFileName == mapFileName) dimensions = map.dimensions;
        });
                
        var bounds = [[0,0], [dimensions.height,dimensions.width]];
        L.imageOverlay(this.baseService.baseUrl + '/maps/' + mapFileName, bounds).addTo(this.leafletMap);
        this.leafletMap.fitBounds(bounds);

        let blueIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
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
          if(marker.roomType != "stairway") continue;

          let lMarker = new L.marker([marker.position.lat,marker.position.lng]);
          lMarker.id = marker.id;

          lMarker.setIcon(blueIcon);
          lMarker.on("click", (e) => {  

            //loop through all other markers to unselect them
            this.leafletMap.eachLayer(layer => {
                if(layer instanceof L.Marker && that.leafletMap.getBounds().contains(layer.getLatLng())) {
                  layer.setIcon(blueIcon);
                }
            });

            that.selectedMarker.origin = that.origin;
            that.selectedMarker.target = lMarker;
            that.selectedMarker.targetMapId = map._id;
            that.selectedMarker.direction = "up";

            lMarker.setIcon(greenIcon);
            let popup = L.popup({className: 'large-popup', width: '500px'});
            popup.setContent('<div class="ui form"> <div class="grouped fields detailFields"><label>Wie kommt man von "' + map.name + '" nach "' + that.mapToCreateName + '"?</label>'+
            '<div class="field"><div class="ui radio checkbox" data-direction="up"><input type="radio" name="direction" checked="checked"><label>Nach oben gehen</label></div></div>'+
            '<div class="field"><div class="ui radio checkbox" data-direction="down"><input type="radio" name="direction"><label>Nach unten gehen</label></div></div></div></div>');

            lMarker.on("popupopen", (e) => {
              if(that.selectedMarker && that.selectedMarker.direction != null) {
                if(that.selectedMarker.direction == "up") {
                  $(".detailFields .radio.checkbox:eq(0)").checkbox("check");
      
                }else{
                  $(".detailFields .radio.checkbox:eq(1)").checkbox("check");
                }
              }else {
                $(".detailFields .radio.checkbox:eq(0)").checkbox("check");
                that.selectedMarker.direction = "up";
              }
      
              //add change handler for checkbox
              $(".detailFields .radio.checkbox").checkbox({
                onChecked: (e) => {
                  that.selectedMarker.direction = $(".grouped.fields.detailFields .checked")[0].dataset.direction;
                }
              });
            });

            lMarker.bindPopup(popup);

          });

          markerArray.push(lMarker);
        }

        this.currentOverlay = L.featureGroup(markerArray).addTo(this.leafletMap);        
      }
    });
  }

  ngOnDestroy() {
    setTimeout(() => { $(".dimmer.modals").remove(); }, 350);    
  }
}
